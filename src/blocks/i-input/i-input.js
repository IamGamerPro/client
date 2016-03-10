'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

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
			this.value = this.defaultValue;
			this.block.removeMod('valid');
		},

		/**
		 * Validates block value
		 * @param params - additional parameters
		 */
		async validate(params): Promise<boolean> {
			if (!this.validators.length || this.reseting) {
				this.reseting = false;
				this.block.removeMod('valid');
				return true;
			}

			let valid;
			for (let el of this.validators) {
				const
					key = Object.isString(el) ? el : Object.keys(el)[0];

				const validator = this.$options.validators[key].call(
					this,
					Object.assign(Object.isObject(el) ? el[key] : {}, params)
				);

				if (validator instanceof Promise) {
					this.block
						.removeMod('valid')
						.setMod('progress', true);
				}

				valid = await validator;
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
		this.block.event.on('block.mod.remove.valid.*', () => this.errorMsg = undefined);
	}

})

@block
export default class iInput extends iData {}
