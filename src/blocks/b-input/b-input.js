'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

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

	methods: {
		selectAll() {
			this[':input'].select();
		},

		clear() {
			this.value = '';
		},

		onEditingStart() {
			this.block.setMod('focused', true);
		},

		onEditing() {

		},

		onEditingEnd() {
			this.block.setMod('focused', false);
		}
	}

}, tpls)

@block
export default class bInput extends iData {}
