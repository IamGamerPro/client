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

	watch: {
		src: {
			immediate: true,

			@wait(status.ready)
			handler() {
				const
					img = new Image(),
					{async: $a, block} = this;

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
								this.emit('resize.progress', progress, id);
							}
						}),

						onComplete: $a.setProxy((cnv, id) => {
							const
								buffer = this.buffer = document.createElement('canvas');

							buffer.width = cnv.width;
							buffer.height = cnv.height;
							buffer.getContext('2d').drawImage(cnv, 0, 0);

							this.src = cnv.toDataURL('image/png');
							this.width = cnv.width;
							this.height = cnv.height;
							this.emit('resize.complete', cnv, id);

							$a.clearAllWorkers();
							block.setMod('progress', false);
						}),

						onError: $a.setProxy((err) => this.emit('resize.error', err))
					});

					$C(workers).forEach((el) => $a.setWorker(el));
				});

				img.src = this.src;
				block.setMod('progress', true);
			}
		}
	},

	methods: {
		@wait(status.ready)
		rotate(side) {
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
		}
	},

	created() {
		this.n = 0;
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
	}

}, tpls)

@block
export default class bImageEditor extends iBlock {}
