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
		/**
		 * The maximum block height
		 */
		maxHeight(): number {
			return Number.parseFloat(getComputedStyle(this.$els.superWrapper).maxHeight);
		},

		/**
		 * The height of a newline
		 */
		newlineHeight(): number {
			return Number.parseFloat(getComputedStyle(this.$els.input).lineHeight) || 10;
		},

		/**
		 * The number of remaining characters
		 */
		limit(): number {
			return this.maxlength - this.value.length;
		}
	},

	watch: {
		value: 'calcHeight'
	},

	methods: {
		/**
		 * Calculates block height
		 */
		calcHeight() {
			const
				{input} = this.$els,
				{length} = this.value;

			if (input.scrollHeight <= input.clientHeight) {
				if (input.clientHeight > this.minHeight && (this.prevValue || '').length > length) {
					this.minimize();
				}

				return;
			}

			const
				{maxHeight} = this;

			if (maxHeight && input.scrollHeight > maxHeight) {
				input.style.height = input.scrollHeight.px;
			}

			let newHeight = input.scrollHeight + (this.extRowCount - 1) * this.newlineHeight;
			input.style.height = newHeight.px;

			if (maxHeight) {
				newHeight = newHeight < maxHeight ? newHeight : maxHeight;
			}

			this.$refs.scroll.setHeight(newHeight);
		},

		/**
		 * Returns textarea height by the specified parameters
		 *
		 * @param text
		 * @param width
		 */
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

		/**
		 * Minimizes textarea
		 */
		minimize() {
			const
				{input} = this.$els,
				{scroll} = this.$refs;

			const
				val = this.value,
				{maxHeight} = this;

			let newHeight = this.calcTextHeight(`${val}\n`, input.offsetWidth);
			newHeight = newHeight < this.minHeight ? this.minHeight : newHeight;

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
			this.minHeight = this.$els.input.clientHeight;
			this.calcHeight();
		});
	}

}, tpls)

@block
export default class bTextarea extends bInput {}
