'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import bWindow from '../b-window/b-window';
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
			const
				{x, y, width, height} = this.$refs.avatar.getSelectedRect();

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
		}
	}

}, tpls)

@block
export default class bAvatarUploader extends bWindow {}
