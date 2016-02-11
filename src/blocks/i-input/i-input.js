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
import { $watch } from '../i-block/i-block';
import { block, model } from '../../core/block';

@model({
	props: {
		@$watch('validate')
		value: {},
		defaultValue: {},

		id: {
			type: String
		},

		name: {
			type: String
		},

		validators: {
			type: Array,
			default: () => []
		}
	},

	mods: {
		valid: [
			'true',
			'false'
		]
	},

	/**
	 * Map of value validators
	 */
	validators: {
		required({msg, showMsg = true}): boolean {
			if (!this.value || Object.isArray(this.value) && !this.value.length) {
				if (showMsg) {
					this.errorMsg = msg || i18n('Обязательное поле');
				}

				return false;
			}

			return true;
		}
	},

	methods: {
		/**
		 * Resets block value to default
		 */
		reset() {
			this.value = this.defaultValue;
			this.block.removeMod('valid');
		},

		/**
		 * Validates block value
		 */
		validate(): boolean {
			if (

				!$C(this.validators).every((el) => {
					const key = Object.isString(el) ? el : Object.keys(el)[0];
					return this.$options.validators[key].call(this, Object.isObject(el) ? el[key] : {})
				})

			) {

				this.block.setMod('valid', false);
				return false;
			}

			this.block.setMod('valid', true);
			return true;
		}
	}

})

@block
export default class iInput extends iData {}
