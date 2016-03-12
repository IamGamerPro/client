'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bInput from '../b-input/b-input';
import * as tpls from './b-textarea.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		maxHeight: {
			type: Number
		},

		maxLength: {
			type: Number
		},

		extRowCount: {
			type: Number,
			default: 1
		}
	},

	mods: {
		collapsed: [
			'true',
			['false']
		]
	},

	methods: {
		calcHeight() {
			const
				{input} = this.$els;

			const
				val = input.primitiveValue;

			if (this.maxLength) {
				let
					length = this.maxLength - val.length,
					limit = this.$limit;

				if (val.length < this.maxLength / 1.5) {
					this.elMod(limit, 'hidden', true);

				} else {
					this.elMod(limit, 'hidden', false);

					if (length < this.maxLength / 4) {
						this.elMod(limit, 'warning', true);

					} else {
						this.elMod(limit, 'warning', false);
					}

					limit.val(i18n('Осталось символов') + ': ' + length);
				}
			}

			if (input.scrollHeight <= input.clientHeight) {
				// Поле "сворачивается" если высота больше минимальной,
				// а новый текст меньше старого
				if (input.clientHeight > this.minHeight && this.lastValue.length > val.length) {
					this.minimize();
				}

				return this;
			}

			if (this.maxHeight && input.scrollHeight > this.maxHeight) {
				input.cssStyle('height', input.scrollHeight);
			}

			var
				rowHeight = parseInt(getComputedStyle(input).lineHeight) || 10,
				newHeight = input.scrollHeight + (this._inputInited ? (this.extRowCount - 1) * rowHeight : 0);

			input.cssStyle('height', newHeight);
			if (this.maxHeight) {
				newHeight = newHeight < this.maxHeight ? newHeight : this.maxHeight;
			}

			this.$scrollArea.setHeight(newHeight);
			this.lastValue = val;
		},

		calcTextHeight(text: string, width: string): number {
			const wrapper = document.createElement('div');
			wrapper.innerHTML = text;
			Object.assign(wrapper.style, {
				'position': 'absolute',
				'top': 0,
				'left': 0,
				'z-index': -1,
				'width': width,
				'white-space': 'pre-wrap'
			});

			document.body.append(wrapper);
			const height = wrapper.offsetHeight;
			wrapper.remove();

			return height;
		},

		minimize() {
			const
				{input} = this.$els,
				{scroll} = this.$refs;

			const
				val = input.primitiveValue;

			let newHeight = this.calcTextHeight(`${val}\n`, input.offsetWidth);
			newHeight = newHeight < this.minHeight ? this.minHeight : newHeight;

			if (val) {
				input.style.height = newHeight.px;

			} else {
				delete input.style.height;
			}

			if (this.maxHeight) {
				scroll.setHeight(newHeight < this.maxHeight ? newHeight : this.maxHeight);

			} else {
				scroll.setHeight(newHeight);
			}
		}
	}

}, tpls)

@block
export default class bTextarea extends bInput {}
