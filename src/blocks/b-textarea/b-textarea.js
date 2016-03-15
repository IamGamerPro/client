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

	computed: {
		maxHeight() {
			return parseFloat(getComputedStyle(this.$els.superWrapper).maxHeight);
		},

		scrollStep() {
			return parseFloat(getComputedStyle(input).lineHeight) || 10;
		}
	},

	methods: {
		calcHeight() {
			const
				{input, limit} = this.$els,
				{block, maxHeight} = this;

			const
				val = this.primitiveValue,
				prevVal = this.prevPrimitiveValue;

			if (this.maxLength) {
				const
					length = this.maxLength - val.length;

				if (val.length < this.maxLength / 1.5) {
					block.elMod(limit, 'limit', 'hidden', true);

				} else {
					block.elMod(limit, 'limit', 'hidden', false);

					if (length < this.maxLength / 4) {
						block.elMod(limit, 'limit', 'warning', true);

					} else {
						block.elMod(limit, 'limit', 'warning', false);
					}

					this.$set('limit', length);
				}
			}

			if (input.scrollHeight <= input.clientHeight) {
				if (input.clientHeight > this._minHeight && prevVal.length > val.length) {
					this.minimize();
				}

				return;
			}

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
				val = input.primitiveValue,
				{maxHeight} = this;

			let newHeight = this.calcTextHeight(`${val}\n`, input.offsetWidth);
			newHeight = newHeight < this._minHeight ? this._minHeight : newHeight;

			if (val) {
				input.style.height = newHeight.px;

			} else {
				input.style.height = 'auto';
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
