'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import mask from './mask';

export default Object.assign({
	/**
	 * Selects all content of the input
	 */
	selectAll() {
		this.$els.input.select();
		this.$emit('selectAll');
	},

	/** @override */
	focus() {
		this.$els.input.focus();
		this.$emit('focus');
	},

	/**
	 * Clears value of the input
	 */
	clear() {
		this.value = undefined;
		this.$emit('clear');
	},

	/**
	 * The start of editing
	 */
	onEditingStart() {
		this.block.setMod('focused', true);
	},

	/**
	 * The end of editing
	 */
	onEditingEnd() {
		this.block.setMod('focused', false);
	}

}, mask);
