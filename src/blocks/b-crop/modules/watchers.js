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

export default {
	selectable: {
		immediate: true,

		@wait(status.ready)
		handler(val) {
			if (val) {
				this.initSelect();

			} else if (this._selectDNDGroup) {
				this.async.removeNodeEventListener({group: this._selectDNDGroup});
			}
		}
	},

	selectByClick: {
		immediate: true,

		@wait(status.ready)
		handler(val) {
			if (val && this.minWidth && this.minHeight) {
				this._areaEvent = false;

				const
					{area, select} = this.$els;

				this.async.addNodeEventListener(area, 'mousedown touchstart', {
					group: 'selectByClick',
					fn: (e) => {
						if (e.target.matches(this.block.getElSelector('area'))) {
							this._areaEvent = true;
						}
					}
				});

				this.async.addNodeEventListener(document, 'mouseup touchend', {
					group: 'selectByClick',
					fn: () => {
						if (this._areaEvent) {
							this.async.setImmediate(() => this._areaEvent = false);
						}
					}
				});

				this.async.addNodeEventListener(area, 'click', {
					group: 'selectByClick',
					fn: (e) => {
						if (this._areaEvent === false) {
							return;
						}

						this.block.removeElMod(select, 'hidden');
						const {top, left} = this.$els.clone.getPosition();

						this.setFixSize({
							x: e.pageX - left,
							y: e.pageY - top,
							width: this.clickWidth || this.minWidth || 100,
							height: this.clickHeight || this.minHeight || 100
						});
					}
				});

			} else {
				this.async.removeNodeEventListener({group: 'selectByClick'});
			}
		}
	}
};
