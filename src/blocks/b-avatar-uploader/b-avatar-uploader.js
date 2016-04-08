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
import series from 'async/series';
import bWindow from '../b-window/b-window';
import Editor, { ImageEditorError } from '../../core/imageEditor';
import * as tpls from './b-avatar-uploader.ss';
import { block, model } from '../../core/block';

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

		errorMsg: {
			type: String
		}
	},

	mods: {
		hidden: [
			'true',
			['false']
		]
	},

	watch: {
		stage(val, oldVal) {
			this.async.clearAll({group: `stage.${oldVal}`});
		},

		errorMsg(val) {
			if (val) {
				this.stage = 'error';
			}
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
				upload: i18n('Загрузка аватара на сервер')
			}[this.stage];
		},

		/**
		 * Collection of thumb image nodes
		 */
		thumbs(): HTMLCollection {
			return this.$els.thumbs.children;
		}
	},

	methods: {
		/**
		 * Switches to the next stage
		 */
		next() {
			const stage = {
				select: 'editor',
				editor: 'thumbs',
				thumbs: 'upload'
			}[this.stage];

			switch (stage) {
				case 'thumbs': {
					const { original } = this.$refs;
					this.original = original.getImageDataURL();
					this.avatar = original.getSelectedImageDataURL();
					this.$refs.next.disable();

				} break;
			}

			this.stage = stage;
		},

		/**
		 * Switches to the previous stage
		 */
		prev() {
			this.errorMsg = undefined;
			this.stage = {
				editor: 'select',
				thumbs: 'editor',
				upload: 'thumbs',
				error: 'select'
			}[this.stage];
		},

		/**
		 * Error handler
		 *
		 * @param el
		 * @param err
		 */
		onError(el: Vue, err: Error) {
			if (err instanceof ImageEditorError) {
				this.errorMsg = i18n('Некорректный формат изображения, попробуй загрузить другое.');

			} else {
				this.errorMsg = i18n('Ошибка при загрузке изображения.');
			}
		},

		/**
		 * Sets an original image
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
		 */
		initThumbs() {
			const
				{avatar, next} = this.$refs;

			const img = document.createElement('img');
			img.src = avatar.getImageDataURL();

			const
				tasks = [];

			$C(this.thumbs).forEach((el) => {
				const
					thumb = img.cloneNode(false);

				tasks.push((cb) => {
					thumb.onInit(this.async.setProxy({
						group: 'stage',
						fn:() => {
							this.setThumb(el, thumb);
							cb();
						}
					}));
				});

				el.append(thumb);
			});

			series(tasks, () => next.enable())
		},

		/**
		 * Sets a thumb image by the selected area
		 *
		 * @param box - thumb container
		 * @param img - thumb image
		 */
		setThumb(box: Element, img?: HTMLImageElement = box.children[0]) {
			const {x, y, width, height} = this.$refs.avatar.getSelectedRect();
			box.dataset.selected = JSON.stringify({x, y, width, height});

			const
				ratioW = box.clientWidth / width,
				ratioH = box.clientHeight / height;

			img.onInit(this.async.setProxy({
				group: 'stage',
				fn: () => {
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
				}
			}));
		},

		/**
		 * Updates thumb images
		 */
		updateThumbs() {
			$C(this.thumbs).forEach((el) => this.setThumb(el));
		},

		async convertThumbToBlob({base, thumb, onProgress, mime = 'image/png', quality = 1}): Promise<Blob> {
			const
				sel = JSON.parse(thumb.dataset.selected);

			const
				width = thumb.clientWidth,
				height = thumb.clientHeight;

			if (width >= sel.width) {
				const
					img = document.createElement('canvas');

				img.width = width;
				img.height = height;
				img.getContext('2d').drawImage(
					base,
					sel.x,
					sel.y,
					sel.width,
					sel.height,
					0,
					0,
					width,
					height
				);

				return new Promise((resolve) => img.toBlob(resolve, mime, quality));
			}

			const
				img = document.createElement('canvas');

			img.width = sel.width;
			img.height = sel.height;
			img.getContext('2d').drawImage(
				base,
				sel.x,
				sel.y,
				sel.width,
				sel.height,
				0,
				0,
				sel.width,
				sel.height
			);

			return new Promise((resolve, reject) => {
				const workers = Editor.resize({
					id: uuid.v4(),
					skipTest: true,
					lobes: 2,

					img,
					width,
					height,
					onProgress,

					onComplete: this.async.setProxy({
						group: `stage.${this.stage}`,
						fn: (canvas) => canvas.toBlob(resolve, mime, quality)
					}),

					onError: reject
				});

				$C(workers).forEach((worker) => {
					this.async.addWorker({group: 'stage', worker});
				});
			});
		}
	}

}, tpls)

@block
export default class bAvatarUploader extends bWindow {}
