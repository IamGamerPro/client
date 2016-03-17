'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';

export default {
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
		this.value = '';
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
	},

	/**
	 * Updates the mask value
	 */
	updateMask() {
		const
			{mask, maskPlaceholder} = this,
			value = [];

		let
			tpl = '',
			sys = false;

		$C(mask).forEach((el) => {
			if (el === '%') {
				sys = true;
				return;
			}

			tpl += sys ? maskPlaceholder : el;

			if (sys) {
				value.push(new RegExp(`\\${el}`));
				sys = false;

			} else {
				value.push(el);
			}
		});

		this._mask = {value, tpl};
	}
};
