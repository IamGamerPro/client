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

	computed: {
		maxHeight() {
			return parseFloat(getComputedStyle(this.$els.superWrapper).maxHeight);
		},

		scrollStep() {
			return parseFloat(getComputedStyle(this.$els.input).lineHeight) || 10;
		},

		limit() {
			return this.maxLength - this.primitiveValue.length;
		}
	},

	methods: {
		calcHeight() {
			const
				{input} = this.$els,
				{length} = this.primitiveValue;

			if (input.scrollHeight <= input.clientHeight) {
				if (input.clientHeight > this._minHeight && this.prevPrimitiveValue.length > length) {
					this.minimize();
				}

				return;
			}

			const
				{maxHeight} = this;

			if (maxHeight && input.scrollHeight > maxHeight) {
				input.style.height = input.scrollHeight.px;
			}

			let newHeight = input.scrollHeight + (this.extRowCount - 1) * this.scrollStep;
			input.style.height = newHeight.px;

			if (maxHeight) {
				newHeight = newHeight < maxHeight ? newHeight : maxHeight;
			}

			this.$refs.scroll.setHeight(newHeight);
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
				val = this.primitiveValue,
				{maxHeight} = this;

			let newHeight = this.calcTextHeight(`${val}\n`, input.offsetWidth);
			newHeight = newHeight < this._minHeight ? this._minHeight : newHeight;

			if (val) {
				input.style.height = newHeight.px;

			} else {
				input.style.height = '';
			}

			if (maxHeight) {
				scroll.setHeight(newHeight < maxHeight ? newHeight : maxHeight);

			} else {
				scroll.setHeight(newHeight);
			}
		}
	},

	ready() {
		this.putInStream(() => {
			this._minHeight = this.$els.input.clientHeight;
			this.calcHeight();
		});

		this.$watch('value', () => this.calcHeight())
	}

}, tpls)

@block
export default class bTextarea extends bInput {}
