'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import bInput from '../b-input/b-input';
import * as tpls from './b-textarea.ss';
import { model } from '../../core/block';

@model(tpls)
export default class bTextarea extends bInput {
	/**
	 * Row count for extending
	 */
	extRowCount: number = 1;

	/** @override */
	$refs(): {superWrapper: Element, scroll: Element, input: HTMLInputElement} {}

	/** @override */
	static mods = {
		collapsed: [
			'true',
			['false']
		]
	};

	/**
	 * Recalculates height
	 */
	$$value() {
		this.calcHeight();
	}

	/**
	 * Maximum block height
	 */
	get maxHeight(): number {
		return Number.parseFloat(getComputedStyle(this.$refs.superWrapper).maxHeight);
	}

	/**
	 * Height of a newline
	 */
	get newlineHeight(): number {
		return Number.parseFloat(getComputedStyle(this.$refs.input).lineHeight) || 10;
	}

	/**
	 * Number of remaining characters
	 */
	get limit(): number {
		return this.maxlength - this.value.length;
	}

	/**
	 * Calculates block height
	 */
	calcHeight() {
		const
			{input} = this.$refs,
			{length} = this.value;

		if (input.scrollHeight <= input.clientHeight) {
			if (input.clientHeight > this.minHeight && (this.prevValue || '').length > length) {
				this.async.setImmediate({
					label: 'minimize',
					fn: () => this.minimize()
				});
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
	}

	/**
	 * Returns real textarea height
	 */
	calcTextHeight(): number {
		const
			{input} = this.$refs;

		const
			tmp = this.$el.cloneNode(true),
			tmpInput = tmp.query(this.block.getElSelector('input'));

		tmpInput.value = input.value;
		Object.assign(tmpInput.style, {
			width: input.clientWidth.px,
			height: 'auto'
		});

		Object.assign(tmp.style, {
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'z-index': -1
		});

		document.body.append(tmp);
		const height = tmpInput.scrollHeight;
		tmp.remove();

		return height;
	}

	/**
	 * Minimizes textarea
	 */
	minimize() {
		const
			{input} = this.$refs,
			{scroll} = this.$refs;

		const
			val = this.value,
			{maxHeight} = this;

		let newHeight = this.calcTextHeight();
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

	/** @override */
	mounted() {
		this.putInStream(() => {
			this.minHeight = this.$refs.input.clientHeight;
			this.calcHeight();
		});
	}
}
