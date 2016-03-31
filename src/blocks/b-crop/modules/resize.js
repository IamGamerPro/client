'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { wait } from '../../i-block/i-block';
import { status } from '../../../core/block';
import { delegate } from '../../../core/dom';

export default {
	@wait(status.ready)
	initSelectable() {
		const
			{r, area, select, clone} = this.$els,
			{offsetWidth: sWidth, offsetHeight: sHeight} = r,
			{block} = this;

		let
			pageX,
			pageY,
			init;

		this.dnd(area, {
			group: 'dnd.selectable',
			onDragStart: (e) => {
				if (this._areaEvent === false) {
					return;
				}

				pageX = e.pageX;
				pageY = e.pageY;

				this.block.setElMod(select, 'select', 'hidden', true);
			},

			onDrag: (e) => {
				if (
					this._areaEvent === false ||
					init ||
					(!init && Math.abs(e.pageX - pageX) < sWidth * 3 && Math.abs(e.pageY - pageY) < sHeight * 3)

				) {
					return;
				}

				block.removeElMod(select, 'select', 'hidden');
				const {left, top} = clone.getPosition();

				const
					x = pageX - left,
					y = pageY - top;

				let
					width = e.pageX - pageX,
					height = e.pageY - pageY;

				const
					hor = width < 0 ? 'left' : 'right',
					vert = height < 0 ? 'top' : 'bottom';

				width = Math.abs(width);
				height = Math.abs(height);

				this.setSize({
					x,
					y,
					width,
					height
				});

				init = true;

				const
					trigger = new MouseEvent(e.type === 'mousemove' ? 'mousedown' : 'touchstart', e);

				trigger.cancelMinMax = true;
				this.block.element('r', ['hor-align', hor], ['vert-align', vert]).dispatchEvent(trigger);
			},

			onDragEnd: () => {
				if (!init) {
					return;
				}

				init = false;
				if (this._areaEvent !== null) {
					this._areaEvent = false;
				}

				this.setFixSize({
					x: select.offsetLeft,
					y: select.offsetTop,
					width: select.offsetWidth,
					height: select.offsetHeight
				});
			}
		});
	},

	initSelectResize() {
		const
			{area, select, clone} = this.$els,
			{width: iWidth, height: iHeight} = this.img(),
			{block, ratably, minWidth: defMinWidth, minHeight: defMinHeight} = this;

		let
			offsetY,
			offsetX;

		let
			baseY,
			baseX;

		let
			width,
			height;

		let
			baseRate;

		let
			pWidth,
			pHeight;

		let
			type,
			target,
			alt;

		let
			minWidth,
			minHeight;

		let
			lastTop,
			lastLeft,
			lastWidth,
			lastHeight;

		let
			toAlt,
			cancelMinMax;

		const setSize = (left, top, width, height) => {
			const
				vert = Boolean(top || height),
				hor = Boolean(left || width);

			left = Object.isNumber(left) ? left : lastLeft;
			top = Object.isNumber(top) ? top : lastTop;
			width = Object.isNumber(width) ? width : lastWidth;
			height = Object.isNumber(height) ? height : lastHeight;

			let
				breakTop,
				breakLeft;

			if (left < 0) {
				left = 0;
				breakLeft = true;
			}

			if (top < 0) {
				top = 0;
				breakTop = true;
			}

			if (!cancelMinMax) {
				if (ratably) {
					if (type === 'top-left') {
						const
							diff = width - lastWidth;

						top = lastTop - diff;
						left = lastLeft - diff;

						height = lastHeight + diff;

					} else if (type === 'bottom-left') {
						const
							diff = width - lastWidth;

						height = lastHeight + diff;
						left = lastLeft - diff;

					} else if (type === 'top-right' || type === 'bottom-right') {
						width = height;
					}

					if (
						left < 0 ||
						top < 0 ||
						height + top > iHeight ||
						width + left > iWidth ||
						(width / height).toFixed(1) !== baseRate

					) {
						left = lastLeft;
						top = lastTop;
						width = lastWidth;
						height = lastHeight;
					}
				}

				let
					{minWidth, maxWidth, minHeight, maxHeight} = this.getMinMax(width, height);

				if (hor) {
					const
						maxW = lastWidth > maxWidth ? lastWidth : maxWidth,
						minW = lastWidth < minWidth ? lastWidth : minWidth;

					if (minWidth && width <= minW) {
						if (lastLeft < left) {
							left = lastLeft + lastWidth - minW;
							width = lastLeft !== left ? minW : lastWidth;

						} else {
							width = minW;
						}

					} else if (maxWidth && width >= maxW) {
						if (lastLeft > left) {
							left = lastWidth !== maxW ?
							lastLeft - (maxW - lastWidth) : lastLeft;
							breakLeft = false;
						}

						width = maxW;
					}
				}

				if (vert) {
					const
						maxH = lastHeight > maxHeight ? lastHeight : maxHeight,
						minH = lastHeight < minHeight ? lastHeight : minHeight;

					if (minHeight && height <= minH) {
						if (lastTop < top) {
							top = lastTop + lastHeight - minH;
							height = lastTop !== top ? minH : lastHeight;

						} else {
							height = minH;
						}

					} else if (maxHeight && height >= maxH) {
						if (lastTop > top) {
							top = lastHeight !== maxH ?
							lastTop - (maxH - lastHeight) : lastTop;
							breakTop = false;
						}

						height = maxH;
					}
				}
			}

			if (breakLeft) {
				width = lastWidth;

			} else if (width + left > iWidth) {
				width -= width + left - iWidth;
				width = width < 0 ? lastWidth : width;
			}

			if (breakTop) {
				height = lastHeight;

			} else if (height + top > iHeight) {
				height -= height + top - iHeight;
				height = height < 0 ? iHeight : height;
			}

			Object.assign(select.style, {
				top: (lastTop = top).px,
				left: (lastLeft = left).px,
				width: (lastWidth = width).px,
				height: (lastHeight = height).px
			});

			clone.style.clip = `rect(
				${lastTop.px},
				${(lastWidth + lastLeft).px},
				${(lastHeight + lastTop).px},
				${lastLeft.px}
			)`;

			baseRate = (lastWidth / lastHeight).toFixed(1);
		};

		const init = (node, e, cancelMinMaxForce) => {
			if (e.cancelMinMax || cancelMinMaxForce) {
				minWidth = 0;
				minHeight = 0;
				cancelMinMax = true;

			} else {
				minWidth = defMinWidth;
				minHeight = defMinHeight;
			}

			target = node;
			const {top, left} = target.getOffset(area);

			offsetY = e.pageY - top;
			offsetX = e.pageX - left;

			lastTop = select.offsetTop;
			lastLeft = select.offsetLeft;

			baseY = e.pageY + target.offsetHeight / 2;
			baseX = e.pageX + target.offsetWidth / 2;

			pWidth = minWidth ? (minWidth / 6) : target.offsetWidth;
			pHeight = minWidth ? (minHeight / 6) : target.offsetHeight;

			width = lastWidth = select.offsetWidth;
			height = lastHeight = select.offsetHeight;

			baseRate = (lastWidth / lastHeight).toFixed(1);
			type = `${block.getElMod(target, 'r', 'vert-align')}-${block.getElMod(target, 'r', 'hor-align')}`;

			switch (type) {
				case 'middle-left':
					alt = block.element('r', ['vert-align', 'middle'], ['hor-align', 'right']);
					break;

				case 'middle-right':
					alt = block.element('r', ['vert-align', 'middle'], ['hor-align', 'left']);
					break;

				case 'top-middle':
					alt = block.element('r', ['vert-align', 'bottom'], ['hor-align', 'middle']);
					break;

				case 'bottom-middle':
					alt = block.element('r', ['vert-align', 'top'], ['hor-align', 'middle']);
					break;

				case 'top-left':
					alt = {
						bottom: block.element('r', ['vert-align', 'bottom'], ['hor-align', 'left']),
						right: block.element('r', ['vert-align', 'top'], ['hor-align', 'right']),
						bottomRight: block.element('r', ['vert-align', 'bottom'], ['hor-align', 'right'])
					};

					break;

				case 'bottom-left':
					alt = {
						top: block.element('r', ['vert-align', 'top'], ['hor-align', 'left']),
						right: block.element('r', ['vert-align', 'bottom'], ['hor-align', 'right']),
						topRight: block.element('r', ['vert-align', 'top'], ['hor-align', 'right'])
					};

					break;

				case 'top-right':
					alt = {
						bottom: block.element('r', ['vert-align', 'bottom'], ['hor-align', 'right']),
						left: block.element('r', ['vert-align', 'top'], ['hor-align', 'left']),
						bottomLeft: block.element('r', ['vert-align', 'bottom'], ['hor-align', 'left'])
					};

					break;

				case 'bottom-right':
					alt = {
						top: block.element('r', ['vert-align', 'top'], ['hor-align', 'right']),
						left: block.element('r', ['vert-align', 'bottom'], ['hor-align', 'left']),
						topLeft: block.element('r', ['vert-align', 'top'], ['hor-align', 'left'])
					};

					break;
			}
		};

		function switchSide(e, width, height, control, action) {
			width = Object.isNumber(width) ? width : NaN;
			width = width <= pWidth ? pWidth / 2 : width;

			height = Object.isNumber(height) ? height : NaN;
			height = height <= pHeight ? pHeight / 2 : height;

			if ((height < pHeight || width < pWidth) && !control) {
				if (Object.isArray(action)) {
					if (height < pHeight && width > pWidth) {
						init(action[0], e, cancelMinMax);

					} else if (height > pHeight && width < pWidth) {
						init(action[1], e, cancelMinMax);

					} else {
						init(action[2], e, cancelMinMax);
					}

				} else {
					init(action, e, cancelMinMax);
				}

				toAlt = true;
				return false;
			}

			if ((isNaN(height) || height > pHeight) && (isNaN(width) || width > pWidth)) {
				toAlt = false;
			}

			return {width, height};
		}

		this.dnd(area, {
			group: 'dnd.selectResize',
			onDragStart: {
				capture: true,

				@delegate(block.getElSelector('r'))
				handler(e) {
					e.stopPropagation();
					block.setMod('active', true);
					init(e.target, e, cancelMinMax);
				}
			},

			onDrag: (e) => {
				const
					top = e.pageY - offsetY,
					left = e.pageX - offsetX;

				const
					diffY = e.pageY - baseY,
					diffX = e.pageX - baseX;

				switch (type) {
					case 'top-left': {
						const
							res = switchSide(e, width - diffX, height - diffY, toAlt, [alt.bottom, alt.right, alt.bottomRight]);

						if (!res) {
							break;
						}

						setSize(left, top, res.width, res.height);
					} break;

					case 'middle-left': {
						const
							res = switchSide(e, width - diffX, null, toAlt, alt);

						if (!res) {
							break;
						}

						setSize(left, null, res.width, null);
					} break;

					case 'bottom-left': {
						const
							res = switchSide(e, width - diffX, height + diffY, toAlt, [alt.top, alt.right, alt.topRight]);

						if (!res) {
							break;
						}

						setSize(left, null, res.width, res.height);
					} break;

					case 'top-middle': {
						const
							res = switchSide(e, null, height - diffY, toAlt, alt);

						if (!res) {
							break;
						}

						setSize(null, top, null, res.height);
					} break;

					case 'bottom-middle': {
						const
							res = switchSide(e, null, height + diffY, toAlt, alt);

						if (!res) {
							break;
						}

						setSize(null, null, null, res.height);
					} break;

					case 'top-right': {
						const
							res = switchSide(e, width + diffX, height - diffY, toAlt, [alt.bottom, alt.left, alt.bottomLeft]);

						if (!res) {
							break;
						}

						setSize(null, top, res.width, res.height);
					} break;

					case 'middle-right': {
						const
							res = switchSide(e, width + diffX, null, toAlt, alt);

						if (!res) {
							break;
						}

						setSize(null, null, res.width, null);
					} break;

					case 'bottom-right': {
						const
							res = switchSide(e, width + diffX, height + diffY, toAlt, [alt.top, alt.left, alt.topLeft]);

						if (!res) {
							break;
						}

						setSize(null, null, res.width, res.height);
					} break;
				}
			},

			onDragEnd: () => {
				block.setMod('active', false);
				cancelMinMax = false;
			}
		});
	}
};
