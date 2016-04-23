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
import { block, model } from '../../core/block';
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
		@wait('ready')
		initImage(src: string) {
			if (src) {
				this.src = src;
			}

			const
				img = new Image(),
				{async: $a} = this;

			$a.clearAll({group: 'initImage'});
			img.onload = $a.setProxy({
				group: 'initImage',
				fn: () => {
					const workers = Editor.resize({
						img,
						canvas: this.canvas,
						lobes: this.smooth,
						width: this.maxWidth,
						height: this.maxHeight,
						skipTest: this.skipTest,
						onProgress: $a.setProxy({
							group: 'initImage',
							single: false,
							fn: (progress, id) => {
								this.$refs.progress.value = progress;
								this.emit('image.progress', progress, id);
							}
						}),

						onComplete: $a.setProxy({
							group: 'initImage',
							fn: (canvas, id) => {
								$a.clearAllWorkers({group: 'initImage'});

								const
									buffer = this.buffer = document.createElement('canvas');

								buffer.width = canvas.width;
								buffer.height = canvas.height;
								buffer.getContext('2d').drawImage(canvas, 0, 0);
								this.src = canvas.toDataURL('image/png');

								$a.setImmediate({
									group: 'initImage',
									fn: () => {
										this.setMod('progress', false);
										this.emit('image.init', canvas, id);
									}
								});
							}
						}),

						onError: $a.setProxy((err) => this.emit('image.error', err))
					});

					$C(workers).forEach((worker) => $a.setWorker({group: 'initImage', worker}));
				}
			});

			img.src = this.src;
			this.setMod('progress', true);
		},

		/**
		 * Rotates the image
		 * @param [side] - "left" or "right"
		 */
		@wait('ready')
		rotate(side?: string = 'left') {
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
			this.emit('rotate', side);
		},

		/**
		 * Returns coordinates ans size of the selected area
		 */
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

		/**
		 * Returns image data of the selected area
		 */
		getSelectedImageData(): ImageData {
			if (this.tools.crop) {
				const {x, y, width, height} = this.$refs.crop.getSelectedRect();
				return this.ctx.getImageData(x, y, width, height);
			}

			return this.getImageData();
		},

		/**
		 * Returns data uri of the selected area
		 *
		 * @param [mime]
		 * @param [quality]
		 */
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

		/**
		 * Returns blob data of the selected area
		 *
		 * @param [mime]
		 * @param [quality]
		 */
		async getSelectedImageBlob(mime?: string = 'image/png', quality?: number = 1): Promise<Blob> {
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

		/**
		 * Returns image data of the source image
		 */
		getImageData(): ImageData{
			return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
		},

		/**
		 * Returns data uri of the source image
		 *
		 * @param [mime]
		 * @param [quality]
		 */
		getImageDataURL(mime?: string = 'image/png', quality?: number = 1): string {
			return this.canvas.toDataURL(mime, quality);
		},

		/**
		 * Returns blob data of the source image
		 *
		 * @param [mime]
		 * @param [quality]
		 */
		async getImageBlob(mime = 'image/png', quality = 1): Promise<Blob> {
			return new Promise((resolve) => this.canvas.toBlob(resolve, mime, quality));
		}
	},

	created() {
		const
			canvas = this.canvas = document.createElement('canvas');

		if (this.tools.crop) {
			this.event.on('block.mod.set.progress.*', ({value}) => {
				this.$refs.crop.setMod('parentProgress', value);
			});
		}

		this.n = 0;
		this.ctx = canvas.getContext('2d');
		this.initImage();
	}

}, tpls)

@block
export default class bImageEditor extends iBlock {}
