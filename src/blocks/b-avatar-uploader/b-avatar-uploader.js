'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import uuid from 'uuid';
import $C from 'collection.js';
import bWindow from '../b-window/b-window';
import { wait } from '../i-block/i-block';
import Editor, { ImageEditorError } from '../../core/imageEditor';
import * as tpls from './b-avatar-uploader.ss';
import { block, model } from '../../core/block';
import User from '../../core/models/user';
import { c, RequestError } from '../../core/request';
import { UPLOADCARE_PUB_KEY } from '../../core/const/server';
import type { size } from '../b-crop/modules/methods';

@model({
	props: {
		accept: {
			type: String,
			default: 'image/jpeg,image/png,image/gif'
		},

		stage: {
			type: String,
			default: 'select'
		},

		original: {
			type: String
		},

		avatar: {
			type: String
		},

		uploadEvent: {
			type: String,
			default: 'changeUserAvatar'
		},

		errorMsg: {
			type: String
		}
	},

	computed: {
		/**
		 * Window title
		 */
		title(): string {
			return {
				select: i18n('Загрузка нового аватара'),
				editor: i18n('Твой аватар'),
				thumbs: i18n('Выбор миниатюры'),
				editThumbs: i18n('Изменение миниатюры'),
				error: i18n('Ошибочка!'),
				upload: i18n('Загрузка аватара на сервер'),
				uploadThumbs: i18n('Загрузка изменений на сервер')
			}[this.stage];
		},

		/**
		 * Collection of thumb image nodes
		 * (stage: thumbs || editThumbs)
		 */
		thumbs(): HTMLCollection {
			return this.$els.thumbs.children;
		}
	},

	methods: {
		/**
		 * @override
		 * @param [stage]
		 * @param [params] - additional parameters
		 */
		@wait('loading')
		async open(stage?: string = 'select', params?: Object = {}) {
			this.original = undefined;
			this.avatar = undefined;
			this.avatarBlob = undefined;
			this.errorMsg = '';

			if (this.setMod('hidden', false)) {
				this.stage = stage;
				await this.nextTick();
				this.emit('open');
			}

			if (stage === 'editThumbs') {
				const
					img = new Image();

				img.crossOrigin = 'Anonymous';
				img.src = params.avatar;

				await this.async.promise(img.init);

				const
					canvas = document.createElement('canvas'),
					ctx = canvas.getContext('2d');

				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);

				await this.$refs.avatar.initImage(canvas.toDataURL(), params.thumbRect);
			}
		},

		/**
		 * Switches to the next stage
		 */
		async next() {
			const
				{original, next} = this.$refs;

			const stage = {
				select: 'editor',
				editor: 'thumbs',
				thumbs: 'upload',
				editThumbs: 'uploadThumbs'
			}[this.stage];

			try {
				switch (stage) {
					case 'editThumbs':
						next.disable();
						break;

					case 'thumbs':
						next.disable();
						this.original = original.getImageDataURL();
						this.avatar = original.getSelectedImageDataURL();
						this.avatarBlob = await original.getSelectedImageBlob('image/jpeg', 0.8);
						break;

					case 'uploadThumbs':
					case 'upload':
						this.upload();
						break;
				}

				this.stage = stage;

			} catch (err) {
				this.onError(err);
			}
		},

		/**
		 * Switches to the previous stage
		 */
		async prev() {
			this.errorMsg = undefined;
			this.stage = {
				editor: 'select',
				thumbs: 'editor',
				upload: 'thumbs',
				uploadThumbs: 'editThumbs',
				error: 'select'
			}[this.stage];
		},

		/** @override */
		onError(err: Error) {
			if (err instanceof ImageEditorError) {
				this.errorMsg = i18n('Некорректный формат изображения, попробуй загрузить другое.');

			} else if (err instanceof RequestError) {
				this.errorMsg = this.getDefaultErrText(err);

			} else {
				this.errorMsg = i18n('Ошибка при загрузке изображения.');
			}
		},

		/**
		 * Sets an original image
		 * (stage: select)
		 *
		 * @param el
		 * @param img
		 */
		setImage(el: Vue, img: string) {
			this.original = img;
			this.stage = 'editor';
		},

		/**
		 * Initialises thumb images
		 * (stage: thumbs || editThumbs)
		 */
		async initThumbs() {
			const
				{async: $a} = this,
				{avatar, next} = this.$refs;

			const img = document.createElement('img');
			img.src = avatar.getImageDataURL();

			const tasks = [];
			$C(this.thumbs).forEach((el) => {
				const
					oldThumb = el.query('img');

				if (oldThumb) {
					oldThumb.remove();
				}

				const thumb = img.cloneNode(false);
				tasks.push($a.promise(this.setThumb(el, thumb), {group: this.stageGroup}));
				el.append(thumb);
			});

			await $a.promise(Promise.all(tasks), {group: this.stageGroup});
			next.enable();
		},

		/**
		 * Sets a thumb image by the selected area
		 * (stage: thumbs || editThumbs)
		 *
		 * @param box - thumb container
		 * @param [img] - thumb image
		 */
		async setThumb(box: Element, img?: HTMLImageElement = box.children[0]) {
			await this.async.promise(img.init, {group: this.stageGroup});
			const {x, y, width, height} = this.$refs.avatar.getSelectedRect();
			box.dataset.selected = JSON.stringify({x, y, width, height});

			const
				ratioW = box.clientWidth / width,
				ratioH = box.clientHeight / height;

			if (!img.dataset.width) {
				Object.assign(img.dataset, {
					width: img.width,
					height: img.height
				});
			}

			Object.assign(img.style, {
				left: (-x * ratioW).px,
				top: (-y * ratioH).px,
				width: (img.dataset.width * ratioW).px,
				height: (img.dataset.height * ratioH).px
			});
		},

		/**
		 * Updates thumb images
		 * (stage: thumbs || editThumbs)
		 */
		async updateThumbs() {
			await this.async.promise(
				Promise.all($C(this.thumbs).map((el) => this.setThumb(el), {initial: []})),
				{group: this.stageGroup}
			);
		},

		/**
		 * Converts a thumb image to Blob
		 * (stage: thumbs || editThumbs)
		 *
		 * @param thumb
		 * @param [onProgress]
		 * @param [mime]
		 * @param [quality]
		 * @param [stage]
		 */
		convertThumbToBlob({thumb, onProgress, mime = 'image/jpeg', quality = 0.9, stage = this.stage}: {
			thumb: Element,
			onProgress?: (progress: number, id?: string) => void,
			mime?: string,
			quality?: number,
			stage?: string

		}): Promise<Blob> {
			const
				{async: $a} = this;

			const
				group = `stage.${stage}`,
				sel = JSON.parse(thumb.dataset.selected);

			const
				width = thumb.clientWidth,
				height = thumb.clientHeight;

			const
				img = document.createElement('canvas'),
				simple = width >= sel.width;

			img.width = simple ? width : sel.width;
			img.height = simple ? height : sel.height;
			img.getContext('2d').drawImage(
				thumb.children[0],
				sel.x,
				sel.y,
				sel.width,
				sel.height,
				0,
				0,
				img.width,
				img.height
			);

			if (simple) {
				return $a.promise(new Promise((resolve) => img.toBlob(resolve, mime, quality)), {group});
			}

			return $a.promise(new Promise((resolve, reject) => {
				const workers = Editor.resize({
					id: uuid.v4(),
					skipTest: true,
					lobes: 2,

					img,
					width,
					height,

					onProgress,
					onError: reject,
					onComplete: (canvas) => {
						$C(workers).forEach((el) => $a.clearWorker(el));
						canvas.toBlob(resolve, mime, quality)
					}
				});

				$C(workers).forEach((worker) =>
					$a.setWorker({group, worker}));

			}), {group});
		},

		/**
		 * Uploads avatars
		 * (stage: thumbs->upload)
		 */
		async upload() {
			const
				{async: $a} = this,
				thumbRect = this.$refs.avatar.getSelectedRect();

			const
				desc = [],
				tasks = [];

			const
				progress = {},
				length = this.thumbs.length;

			try {
				let prevProgress;
				const onProgress = (val, id) => {
					progress[id] = val;
					let percent = $C(progress).reduce((res, el) => res + el, 0);
					percent = Math.round((percent / (length * 100)) * 100);
					this.$refs.uploadProgress.value = prevProgress = Math.round(percent / 3);
				};

				$C(this.thumbs).forEach((thumb) => {
					desc.push(thumb.dataset.size);
					tasks.push(this.convertThumbToBlob({thumb, onProgress, stage: 'upload'}))
				});

				const files = $C(await $a.promise(Promise.all(tasks), {group: 'stage.upload'})).map((file, i) => ({
					name: desc[i],
					file

				})).concat(this.avatarBlob ? {
					name: 'l',
					file: this.avatarBlob
				} : []);

				const form = new FormData();
				form.append('UPLOADCARE_PUB_KEY', UPLOADCARE_PUB_KEY);
				form.append('UPLOADCARE_STORE', '1');

				$C(files).forEach(({name, file}) =>
					form.append(name, file, name));

				const {response: avatar} = await $a.setRequest({
					group: this.stageGroup,
					req: c('https://upload.uploadcare.com/base/', form, {
						upload: {
							onProgress: (req, e) => {
								const percent = Math.round((e.loaded / e.total) * 100);
								this.$refs.uploadProgress.value = prevProgress + Math.round(percent / 3);
							}
						}
					})
				});

				const
					updData = {avatar, thumbRect};

				await $a.setRequest({
					group: this.stageGroup,
					req: (new User()).upd(updData)
				});

				this.$refs.uploadProgress.value = 100;
				this.globalEvent.emit(this.uploadEvent, updData);
				this.close();

			} catch (err) {
				if (!{abort: true, clear: true}[err.type]) {
					this.onError(err);
				}
			}
		}
	},

	compiled() {
		this.event.on('block.mod.set.hidden.true', () => this.async.clearAll({group: this.stageGroup}));
	}

}, tpls)

@block
export default class bAvatarUploader extends bWindow {}
