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
import { mixin, $watch } from '../i-block/i-block';
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

	computed: {
		/**
		 * Returns a primitive value of the block
		 */
		primitiveValue(): string {
			return String(this.value);
		}
	},

	mods: {
		valid: [
			'true',
			'false'
		]
	},

	@mixin
	validators: {
		required({msg, showMsg = true}): boolean {
			if (!this.primitiveValue) {
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
			this.reseting = true;
			const unwatch = this.$watch('value', () => {
				this.reseting = false;
			}, {immediate: true});

			this.value = this.defaultValue;
			this.block.removeMod('valid');
			unwatch();
		},

		/**
		 * Validates block value
		 * @param params - additional parameters
		 */
		validate(params): boolean {
			if (!this.validators.length || this.reseting) {
				this.block.removeMod('valid');
				return true;
			}

			if (

				!$C(this.validators).every((el) => {
					const key = Object.isString(el) ? el : Object.keys(el)[0];
					return this.$options.validators[key].call(this, Object.assign(Object.isObject(el) ? el[key] : {}, params))
				})

			) {

				this.block.setMod('valid', false);
				return false;
			}

			this.block.setMod('valid', true);
			return true;
		}
	},

	ready() {
		this.block.event.on('block.removeMod.valid.*', () => this.errorMsg = undefined);
	}

})

@block
export default class iInput extends iData {}
