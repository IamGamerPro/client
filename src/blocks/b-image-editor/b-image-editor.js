'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import iBlock, { wait } from '../i-block/i-block';
import Editor from '../../core/imageEditor';
import * as tpls from './b-image-editor.ss';
import { block, model, status } from '../../core/block';
import type { size } from '../b-crop/modules/methods';

@model({
	props: {
		src: {
			type: String
		},

		width: {
			type: Number
		},

		height: {
			type: Number
		},

		alt: {
			type: String
		},

		maxWidth: {
			type: Number,
			default: 600
		},

		maxHeight: {
			type: Number,
			default: 600
		},

		smooth: {
			type: Number,
			default: 1
		},

		skipTest: {
			type: Boolean,
			default: false
		},

		tools: {
			type: Object,
			coerce: (val) => Object.mixin(true, {crop: {}, rotate: {left: true, right: true}}, val)
		}
	},

	methods: {
		/**
		 * Initializes an image
		 * @param [src] - image src
		 */
		@wait(status.ready)
		initImg(src: string) {
			if (src) {
				this.src = src;
			}

			const
				img = new Image(),
				{async: $a, block: $b} = this;

			img.onload = $a.setProxy(() => {
				const workers = Editor.resize({
					img,
					canvas: this.canvas,
					lobes: this.smooth,
					width: this.maxWidth,
					height: this.maxHeight,
					skipTest: this.skipTest,
					onProgress: $a.setProxy({
						single: false,
						fn: (progress, id) => {
							this.$refs.progress.value = progress;
							this.emit('init-img.progress', progress, id);
						}
					}),

					onComplete: $a.setProxy((canvas, id) => {
						const
							buffer = this.buffer = document.createElement('canvas');

						buffer.width = canvas.width;
						buffer.height = canvas.height;
						buffer.getContext('2d').drawImage(canvas, 0, 0);

						this.src = canvas.toDataURL('image/png');
						this.emit('init-img.complete', canvas, id);

						$a.clearAllWorkers();
						$b.setMod('progress', false);
					}),

					onError: $a.setProxy((err) => this.emit('init-img.error', err))
				});

				$C(workers).forEach((el) => $a.setWorker(el));
			});

			img.src = this.src;
			$b.setMod('progress', true);
		},

		/**
		 * Rotates the image
		 * @param side - "left" or "right"
		 */
		@wait(status.ready)
		rotate(side: string) {
			const
				{canvas, ctx, buffer} = this;

			let
				{width, height} = buffer;

			if (side === 'left') {
				this.n--;

			} else {
				this.n++;
			}

			if (Math.abs(this.n) === 4) {
				this.n = 0;
			}

			const
				{n} = this;

			const
				max = width > height ? width : height,
				val = n / n;

			ctx.clearRect(0, 0, max, max);
			ctx.save();

			if (n % 2 !== 0) {
				const
					nHeight = width;

				let
					nnHeight,
					nnWidth;

				if (nHeight > height) {
					nnHeight = height;
					nnWidth = Math.round((height * height) / width);

				} else {
					nnWidth = width;
					nnHeight = Math.round((width * width) / height);
				}

				canvas.width = nnWidth;
				canvas.height = nnHeight;

				width = nnHeight;
				height = nnWidth;

				if (n === -1 || n === 3) {
					ctx.translate(0, width);
					ctx.rotate(-90 * (Math.PI / 180));

				} else {
					ctx.translate(height, 0);
					ctx.rotate(90 * (Math.PI / 180));
				}

			} else {
				canvas.width = width;
				canvas.height = height;
				ctx.translate(val * width, val * height);
				ctx.rotate(val * 180 * (Math.PI / 180));
			}

			ctx.drawImage(this.buffer, 0, 0, width, height);
			ctx.restore();

			this.src = canvas.toDataURL('image/png');
		},

		@wait(status.ready)
		getSelectedRect(): size {
			if (this.tools.crop) {
				return this.$refs.crop.getSelectedRect();
			}

			return {
				x: 0,
				y: 0,
				width: this.canvas.width,
				height: this.canvas.height
			};
		},

		@wait(status.ready)
		getSelectedImageData(): ImageData {
			if (this.tools.crop) {
				const {x, y, width, height} = this.$refs.crop.getSelectedRect();
				return this.ctx.getImageData(x, y, width, height);
			}

			return this.getImageData();
		},

		@wait(status.ready)
		getSelectedImageDataURL(mime?: string = 'image/png', quality?: number = 1): string {
			if (this.tools.crop) {
				const
					{x, y, width, height} = this.$refs.crop.getSelectedRect();

				const
					data = this.ctx.getImageData(x, y, width, height),
					canvas = document.createElement('canvas');

				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d').putImageData(data, 0, 0);

				return canvas.toDataURL(mime, quality);
			}

			return this.getImageDataURL(mime, quality);
		},

		@wait(status.ready)
		getSelectedImageBlob: function (mime?: string = 'image/png', quality?: number = 1): Promise<Blob> {
			if (this.tools.crop) {
				const
					{x, y, width, height} = this.$refs.crop.getSelectedRect();

				const
					data = this.ctx.getImageData(x, y, width, height),
					canvas = document.createElement('canvas');

				canvas.width = width;
				canvas.height = height;
				canvas.getContext('2d').putImageData(data, 0, 0);

				return new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
			}

			return this.getImageBlob(mime, quality);
		},

		@wait(status.ready)
		getImageData(): ImageData{
			return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		},

		@wait(status.ready)
		getImageDataURL: function (mime?: string = 'image/png', quality?: number = 1): string {
			return this.canvas.toDataURL(mime, quality);
		},

		@wait(status.ready)
		getImageBlob(mime = 'image/png', quality = 1): Promise<Blob> {
			return new Promise((resolve) => this.canvas.toBlob(resolve, mime, quality));
		}
	},

	ready() {
		const
			canvas = this.canvas = document.createElement('canvas');

		this.n = 0;
		this.ctx = canvas.getContext('2d');
		this.initImg();
	}

}, tpls)

@block
export default class bImageEditor extends iBlock {}
