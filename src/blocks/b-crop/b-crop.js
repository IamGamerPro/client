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
		getMinMax(width: number, height: number): {
			minWidth: number,
			maxWidth: number,
			minHeight: number,
			maxHeight: number
		} {
			const
				{width: iWidth, height: iHeight} = this.$els.img,
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

		getFixSize(x: number, y: number, width: number, height: number): {
			x: number,
			y: number,
			width: number,
			height: number
		} {
			const
				{width: iWidth, height: iHeight} = this.$els.img,
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

		setSize(x: number, y: number, width: number, height: number) {
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

		setFixSize(x: number, y: number, width: number, height: number): {
			x: number,
			y: number,
			width: number,
			height: number
		} {
			const size = this.getFixSize(x, y, width, height);
			this.setSize(size.x, size.y, size.width, size.height);
			return size;
		},

		initSelect(params) {
			const
				{select} = this.$els,
				{minWidth, maxWidth, minHeight, maxHeight} = this;

			if (params.x != null) {
				this.setFixSize(
					params.x,
					params.y,
					params.width || minWidth,
					params.height || minHeight
				);

			} else {
				let rWidth = this.$img.width,
					rHeight = this.$img.height;

				let w = rWidth > maxWidth ?
					maxWidth : rWidth;

				let h = rHeight > maxHeight ?
					maxHeight : rHeight;

				if (rWidth > rHeight) {
					w = h;

				} else {
					h = w;
				}

				let offset = 20;
				if (!minWidth || w - offset > minWidth) {
					w -= offset;
				}

				if (!minHeight || h - offset > minHeight) {
					h -= offset;
				}

				let left = rWidth / 2 - w / 2,
					top = rHeight / 2 - h / 2;

				this.setSize(left, top, w, h);
			}

			var width,
				height;

			var offsetY,
				offsetX;

			var iWidth = this.$img.width,
				iHeight = this.$img.height;

			this.onDragStart(select, null, (e) => {
				if (this._areaEvent) {
					return;
				}

				this.mod('active', true);

				width = select.offsetWidth;
				height = select.offsetHeight;

				offsetY = e.pageY - select.offsetTop;
				offsetX = e.pageX - select.offsetLeft;

				this.triggerLocalEvent('moveStart', [offsetX, offsetY, width, height]);
			});

			this.onDrag(this.$select, null, (e) => {
				if (this._areaEvent) {
					return;
				}

				var top = e.pageY - offsetY,
					left = e.pageX - offsetX;

				if (top < 0) {
					top = 0;

				} else if (height + top > iHeight) {
					top = iHeight - height;
					top = top < 0 ? 0 : top;
				}

				if (left < 0) {
					left = 0;

				} else if (width + left > iWidth) {
					left = iWidth - width;
					left = left < 0 ? 0 : left;
				}

				this.setSize(left, top, width, height);
				this.triggerLocalEvent('move', [left, top, width, height]);
			});

			this.onDragEnd(select, null, () => {
				if (this._areaEvent) {
					return;
				}

				this.mod('active', false);
				this.triggerLocalEvent('moveEnd');
			});

			return this;
		}
	}

}, tpls)

@block
export default class bCrop extends iBlock {}
