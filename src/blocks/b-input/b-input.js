'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import iData from '../i-data/i-data';
import { PARENT_MODS, bindToParam } from '../i-block/i-block';
import * as tpls from './b-input.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		value: {
			type: String,
			default: ''
		},

		type: {
			type: String,
			default: 'text'
		},

		id: {
			type: String
		},

		name: {
			type: String
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

		mask: {
			type: String
		},

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
		 *
		 * @param mask
		 * @param placeholder
		 */
		updateMask(mask?: string = this.mask, placeholder?: string = this.maskPlaceholder) {
			const
				value = [];

			let
				tpl = '',
				sys = false;

			$C(mask).forEach((el) => {
				if (el === '%') {
					sys = true;
					return;
				}

				tpl += sys ? placeholder : el;

				if (sys) {
					value.push(new RegExp(`\\${el}`));
					sys = false;

				} else {
					value.push(el);
				}
			});

			Object.assign(this.$options.mask, {value, tpl});
		}
	},

	ready() {
		this.$watch('mask', (val) => this.updateMask(val), {immediate: true});
		this.$watch('maskPlaceholder', (val) => this.updateMask(undefined, val));
	}

}, tpls)

@block
export default class bInput extends iData {}
