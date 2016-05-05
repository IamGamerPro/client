'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import mask from './mask';
import { wait } from '../../i-block/i-block';

export default Object.assign({
	/**
	 * Selects all content of the input
	 */
	@wait('ready')
	selectAll() {
		const
			{input} = this.$els;

		if (input.selectionStart !== 0 || input.selectionEnd !== input.value.length) {
			this.$els.input.select();
			this.emit('selectAll');
		}
	},

	/** @override */
	@wait('loading')
	focus() {
		const
			{input} = this.$els;

		if (document.activeElement !== input) {
			input.focus();
			this.emit('focus');
		}
	},

	/**
	 * Clears value of the input
	 */
	@wait('ready')
	clear() {
		if (this.value) {
			this.value = undefined;
			this.emit('clear');
		}
	},

	/**
	 * The start of editing
	 */
	onEditStart() {
		this.setMod('focused', true);
	},

	/**
	 * The end of editing
	 */
	onEditEnd() {
		this.setMod('focused', false);
	}

}, mask);
