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
import Editor from '../../core/imageEditor';
import * as tpls from './b-avatar-uploader.ss';
import { block, model } from '../../core/block';

@model({
	props: {
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

		title: undefined
	},

	mods: {
		hidden: [
			'true',
			['false']
		]
	},

	watch: {
		stage() {
			this.async.clearAll({group: 'stage'});
		}
	},

	computed: {
		title() {
			return {
				select: i18n('Загрузка нового аватара'),
				editor: i18n('Твой аватар'),
				thumbs: i18n('Выбор миниатюры'),
				editThumbs: i18n('Изменение миниатюры'),
				error: i18n('Ошибочка!'),
				upload: i18n('Загрузка аватара на сервер')
			}[this.stage];
		},

		thumbs() {
			return this.$els.thumbs.children;
		}
	},

	methods: {
		setImage(el, img) {
			this.original = img;
			this.stage = 'editor';
		},

		toThumbs() {
			const { original } = this.$refs;
			this.original = original.getImageDataURL();
			this.avatar = original.getSelectedImageDataURL();
			this.stage = 'thumbs';
		},

		initThumbs() {
			const img = document.createElement('img');
			img.src = this.$refs.avatar.getImageDataURL();

			$C(this.thumbs).forEach((el) => {
				const
					thumb = img.cloneNode(false);

				thumb.onInit(this.async.setProxy({
					group: 'stage',
					fn:() => this.setThumb(el, thumb)
				}));

				el.append(thumb);
			});
		},

		setThumb(cont, img = cont.children[0]) {
			const {x, y, width, height} = this.$refs.avatar.getSelectedRect();
			cont.dataset.selected = JSON.stringify({x, y, width, height});

			const
				ratioW = cont.clientWidth / width,
				ratioH = cont.clientHeight / height;

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

		updateThumbs() {
			$C(this.thumbs).forEach((el) => this.setThumb(el));
		},

		convertThumbToBlob({base, thumb, onProgress, mime = 'image/png', quality = 1}): Promise<Blob> {
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
						group: 'stage',
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
