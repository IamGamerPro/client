'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { wait } from '../../i-block/i-block';

export type size = {
	x: number,
	y: number,
	width: number,
	height: number
};

export default {
	/**
	 * Returns coordinates and size of the selection block
	 */
	getSelectedRect(): size {
		const {select} = this.$els;
		return {
			x: select.offsetLeft,
			y: select.offsetTop,
			width: select.offsetWidth,
			height: select.offsetHeight
		};
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

		if (width < minWidth) {
			width = minWidth;

		} else if (width > maxWidth) {
			width = maxWidth;
		}

		if (height < minHeight) {
			height = minHeight;

		} else if (height > maxHeight) {
			height = maxHeight;
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

		if (x < 0) {
			x = 0;

		} else if (x + width > iWidth) {
			x = iWidth - width;
		}

		if (y < 0) {
			y = 0;

		} else if (y + height > iHeight) {
			y = iHeight - height;
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
			${((height || select.offsetHeight) + y).px},
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
	@wait('loading')
	async initSelect(params?: size = {}) {
		this.setMod('progress', true);
		await this.async.setProxyForPromise({
			label: 'initSelect',
			promise: this.$els.img.init
		});

		this._areaEvent = false;
		if (!this.src) {
			return;
		}

		const
			{width: rWidth, height: rHeight} = this.$els.img,
			{minWidth, maxWidth, minHeight, maxHeight} = this;

		if (params.x != null) {
			if (minWidth && minHeight || params.width && params.height) {
				this.setFixSize(Object.assign({width: minWidth, height: minHeight}, params));
			}

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

		this.setMod('progress', false);
	}

};
