'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iInput from '../i-input/i-input';
import { PARENT_MODS, bindToParam, $watch } from '../i-block/i-block';
import * as tpls from './b-input.ss';
import methods from './modules/methods';
import validators from './modules/validators';
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
			type: Boolean
		},

		maxLength: {
			type: Number
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

	computed: {
		primitiveValue() {
			return this.toPrimitive(this.value) || (this.mask ? this._mask.tpl : '');
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

	methods,
	validators

}, tpls)

@block
export default class bInput extends iInput {}
