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
		async validate(params): Promise<boolean> {
			if (!this.validators.length || this.reseting) {
				this.block.removeMod('valid');
				return true;
			}

			this.block
				.removeMod('valid')
				.setMod('progress', true);

			let valid;
			for (let el of this.validators) {
				const
					key = Object.isString(el) ? el : Object.keys(el)[0];

				valid = await this.$options.validators[key].call(
					this,
					Object.assign(Object.isObject(el) ? el[key] : {}, params)
				);

				if (!valid) {
					break;
				}
			}

			this.block
				.setMod('progress', false)
				.setMod('valid', valid);

			return valid;
		}
	},

	ready() {
		this.block.event.on('block.removeMod.valid.*', () => this.errorMsg = undefined);
	}

})

@block
export default class iInput extends iData {}
