'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-crop.ss';
import { block, model } from '../../core/block';

export type size = {
	x: number,
	y: number,
	width: number,
	height: number
};

@model({
	props: {
		minWidth: {
			type: Number,
			default: 200
		},

		minHeight: {
			type: Number,
			default: 200
		},

		maxWidth: {
			type: Number,
			default: 600
		},

		maxHeight: {
			type: Number,
			default: 600
		},

		clickWidth: {
			type: Number
		},

		clickHeight: {
			type: Number
		},

		ratio: {
			type: Array,
			default: () => [1, 3]
		},

		ratably: {
			type: Boolean,
			default: false
		},

		selectable: {
			type: Boolean,
			default: true
		}
	},

	methods: {
		/**
		 * Returns a link to the original image
		 */
		img(): HTMLImageElement {
			return this.$els.original.query('img');
		},

		/**
		 * Returns selection restrictions by the specified parameters
		 *
		 * @param width
		 * @param height
		 */
		getMinMax(width: number, height: number): {
			minWidth: number,
			maxWidth: number,
			minHeight: number,
			maxHeight: number
		} {
			const
				{width: iWidth, height: iHeight} = this.img(),
				{ratio} = this;

			let {minWidth, maxWidth} = this;
			minWidth = minWidth > iWidth ? iWidth : minWidth;
			maxWidth = maxWidth > iWidth ? iWidth : maxWidth;

			let {minHeight, maxHeight} = this;
			minHeight = minHeight > iHeight ? iHeight : minHeight;
			maxHeight = maxHeight > iHeight ? iHeight : maxHeight;

			if (ratio) {
				maxWidth = maxHeight * ratio[0];

				if (width > height) {
					if (width / height > ratio[0]) {
						maxWidth = height > maxWidth ? maxWidth : height;

						const
							val = width / ratio[0];

						if (val > minHeight) {
							minHeight = val;
						}
					}

				} else if (height > width) {
					if (height / width > ratio[1]) {
						maxHeight = width > maxHeight ? maxHeight : width;

						const
							val = height / ratio[1];

						if (val > minWidth) {
							minWidth = val;
						}
					}
				}
			}

			return {minWidth, maxWidth, minHeight, maxHeight};
		},

		/**
		 * Returns coordinates and size of the selection block taking into account the limits and proportions
		 *
		 * @param x
		 * @param y
		 * @param width
		 * @param height
		 */
		getFixSize({x, y, width, height}: size): size {
			const
				{width: iWidth, height: iHeight} = this.img(),
				{minWidth, maxWidth, minHeight, maxHeight, ratio} = this;

			if (ratio) {
				if (width > height) {
					if (width / height > ratio[0]) {
						height = width = width / ratio[0];
					}

				} else if (height > width) {
					if (height / width > ratio[1]) {
						width = height / ratio[1];
					}
				}
			}

			if (minWidth) {
				width = width < minWidth ? minWidth : width;
			}

			if (maxWidth) {
				width = width > maxWidth ? maxWidth : width;
			}

			if (minHeight) {
				height = height < minHeight ? minHeight : height;
			}

			if (maxHeight) {
				height = height > maxHeight ? maxHeight : height;
			}

			if (iWidth > iHeight) {
				if (width > iWidth || height > iHeight) {
					width = height = iHeight;
				}

			} else {
				if (width > iWidth || height > iHeight) {
					width = height = iWidth;
				}
			}

			if (y + height > iHeight) {
				y = iHeight - height;
			}

			if (x + width > iWidth) {
				x = iWidth - width;
			}

			return {x, y, width, height};
		},

		/**
		 * Sets coordinates and size of the selection block by the specified parameters
		 *
		 * @param x
		 * @param y
		 * @param width
		 * @param height
		 */
		setSize({x, y, width, height}: size) {
			const
				{select, clone} = this.$els;

			if (width) {
				Object.assign(select.style, {
					top: y.px,
					left: x.px,
					width: width.px,
					height: height.px
				});
			}

			clone.style.clip = `rect(
				${y.px},
				${((width || select.offsetWidth) + x).px},
				${((height || this.$select.offsetHeight) + y).px},
				${x.px}
			)`;
		},

		/**
		 * Sets coordinates and size of the selection block by the specified parameters
		 * taking into account the limits and proportions
		 * @param params
		 */
		setFixSize(params: size): size {
			const size = this.getFixSize(params);
			this.setSize(size);
			return size;
		},

		/**
		 * Initialises the selection block
		 * @param params - coordinates and size
		 */
		initSelect(params?: size = {}) {
			const
				{select} = this.$els,
				{width: rWidth, height: rHeight} = this.img(),
				{minWidth, maxWidth, minHeight, maxHeight} = this;

			if (params.x != null) {
				this.setFixSize(Object.assign({width: minWidth, height: minHeight}, params));

			} else {
				let
					w = rWidth > maxWidth ? maxWidth : rWidth,
					h = rHeight > maxHeight ? maxHeight : rHeight;

				if (rWidth > rHeight) {
					w = h;

				} else {
					h = w;
				}

				const
					offset = 20;

				if (!minWidth || w - offset > minWidth) {
					w -= offset;
				}

				if (!minHeight || h - offset > minHeight) {
					h -= offset;
				}

				this.setSize({
					x: rWidth / 2 - w / 2,
					y: rHeight / 2 - h / 2,
					width: w,
					height: h
				});
			}
		}
	},

	ready() {
		this.$els.clone.append(this.img().cloneNode(false));
		this.initSelect();
	}

}, tpls)

@block
export default class bCrop extends iBlock {}
