'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-image-editor.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		src: {
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
			default: () => ({crop: {}, rotate: {left: true, right: true}})
		}
	},

	methods: {
		init(params) {
			this.canvas = document.createElement('canvas');
			this.ctx = this.canvas.getContext('2d');

			const img = new Image();
			img.onload = this.async.setProxy({
				single: true,
				fn: () => {
					var workers = Graph.resize({
						img,
						canvas: this.canvas,
						lobes: this.smooth,
						skipTest: this.skipTest,
						width: this.maxWidth,
						height: this.maxHeight,

						complete: this.proxy((err, cnv) => {
							if (MyFireError.ifAnyError(err, (msg) => {
									this.triggerLocalEvent('error', msg);
								})) { return; }

							var buffer = DOM.create('canvas', {
								'width': cnv.width,
								'height': cnv.height
							});

							buffer.getContext('2d').drawImage(cnv, 0, 0);
							this.buffer = buffer;

							this.$img.src = cnv.toDataURL('image/png');
							this.$img.width = cnv.width;
							this.$img.height = cnv.height;

							this.initTools(params.params);
							this.mod('progress', false);

							this.triggerLocalEvent('ready');
						}),

						progress: this.proxy((val) => {
							this.$progress.setStatus(val);
						})
					});

					$C(workers).forEach((el) => {
						this.addWorker(el);
					});
				}
			});

			img.src = this.src;

			this.print();
			this.mod('progress', true);

			return this;
		}
	}

}, tpls)

@block
export default class bImageEditor extends iBlock {}
