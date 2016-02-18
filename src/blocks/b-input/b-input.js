'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import validator from 'validator';
import iInput from '../i-input/i-input';
import { PARENT_MODS, bindToParam, $watch } from '../i-block/i-block';
import * as tpls from './b-input.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		value: {
			type: String,
			default: ''
		},

		defaultValue: {
			type: String,
			default: ''
		},

		type: {
			type: String,
			default: 'text'
		},

		placeholder: {
			type: String
		},

		autocomplete: {
			type: String
		},

		autofocus: {
			type: String
		},

		@$watch('updateMask', {immediate: true})
		mask: {
			type: String
		},

		@$watch('updateMask')
		maskPlaceholder: {
			type: String,
			default: '_'
		}
	},

	mods: {
		theme: [
			PARENT_MODS,
			'dark',
			'dark-form',
			'light-form'
		],

		rounding: [
			PARENT_MODS,
			'none',
			'small',
			['normal']
		],

		width: [
			PARENT_MODS,
			['normal'],
			'full'
		],

		@bindToParam('value', (v) => !v)
		empty: [
			'true',
			'false'
		]
	},

	validators: {
		userName({msg, showMsg = true}): boolean {
			const
				val = this.primitiveValue;

			if (!/^\w*$/.test(val)) {
				if (showMsg) {
					this.errorMsg = msg || i18n(
						'Недопустимые символы.<br>Допускаются только символы латинского алфавита, знак подчёркивания и цифры'
					);
				}

				return false;
			}

			const
				min = 4,
				max = 18;

			if (val.length < min) {
				if (showMsg) {
					this.errorMsg = msg || (
						i18n('Минимальная длина имени должна быть не менее') + min + i18n('символов')
					);
				}

				return false;
			}

			if (val.length > max) {
				if (showMsg) {
					this.errorMsg = msg || (
						i18n('Максимальная длина имени должна быть не более') + max + i18n('символов')
					);
				}

				return false;
			}

			return true;
		},

		email({msg, showMsg = true}): boolean {
			const
				val = this.primitiveValue.trim();

			if (val && !validator.isEmail(val)) {
				if (showMsg) {
					this.errorMsg = msg || i18n('Неверный формат почты');
				}

				return false;
			}

			return true;
		},

		password({msg, connected, showMsg = true}): boolean {
			const
				val = this.primitiveValue;

			if (!/^\w*$/.test(val)) {
				if (showMsg) {
					this.errorMsg = msg || i18n(
						'Недопустимые символы.<br>Допускаются только символы латинского алфавита, знак подчёркивания и цифры'
					);
				}

				return false;
			}

			const
				min = 6,
				max = 16;

			if (val.length < min) {
				if (showMsg) {
					this.errorMsg = msg || (
						i18n('Минимальная длина пароля должна быть не менее') + min + i18n('символов')
					);
				}

				return false;
			}

			if (val.length > max) {
				if (showMsg) {
					this.errorMsg = msg || (
						i18n('Максимальная длина пароля должна быть не более') + max + i18n('символов')
					);
				}

				return false;
			}

			if (connected) {
				const
					val2 = this.$(connected).primitiveValue;

				if (val2 && val2 !== val) {
					if (showMsg) {
						this.errorMsg = msg || i18n('Пароли не совпадают');
					}

					return false;
				}
			}

			return true;
		}
	},

	/**
	 * Mask object
	 */
	mask: {
		tpl: '',
		lastSelectionStartIndex: null,
		lastSelectionEndIndex: null,
		value: []
	},

	methods: {
		/**
		 * Selects all content of the input
		 */
		selectAll() {
			this[':input'].select();
		},

		/**
		 * Clears value of the input
		 */
		clear() {
			this.value = '';
		},

		/**
		 * The start of editing
		 */
		onEditingStart() {
			this.block.setMod('focused', true);
		},

		/**
		 * Editing
		 */
		onEditing() {

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

			Object.assign(this.$options.mask, {value, tpl});
		}
	}

}, tpls)

@block
export default class bInput extends iInput {}
