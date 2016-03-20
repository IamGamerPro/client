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
		@$watch('cache', {immediate: true})
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

	@mixin
	validators: {
		required({msg, showMsg = true}): boolean {
			if (!this.value) {
				if (showMsg) {
					this.errorMsg = msg || i18n('Обязательное поле');
				}

				return false;
			}

			return true;
		}
	},

	computed: {
		/**
		 * Returns the form block value
		 */
		formValue() {
			return this.value;
		}
	},

	methods: {
		/**
		 * Caches the previous block value
		 *
		 * @param newVal
		 * @param oldVal
		 */
		cache(newVal: any, oldVal: any) {
			this.$set('prevValue', oldVal || '');
		},

		/**
		 * Returns default texts for server errors
		 * @param err - error object
		 */
		getDefaultErrText(err): string {
			let msg = '';

			if (err.type !== 'abort') {
				switch (err.type) {
					case 'timeout':
						msg = i18n('Сервер не отвечает');
						break;

					default:
						msg = i18n('Неизвестная ошибка сервера');
				}
			}

			return msg;
		},

		/**
		 * Resets block value to default
		 */
		reset() {
			this.reseting = true;
			this.value = this.defaultValue;
			this.async.clearAll({group: 'validation'});
			this.block.removeMod('valid');
			this.$emit('reset');
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

			this.$emit('validationStart');
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
				.setMod('progress', false);

			if (Object.isBoolean(valid)) {
				this.block.setMod('valid', valid);

			} else {
				this.block.removeMod('valid', valid);
			}

			this.$emit('validationEnd', valid);
			return valid;
		}
	},

	ready() {
		this.block.event.on('block.mod.remove.valid.*', () => this.errorMsg = undefined);
	}

})

@block
export default class iInput extends iData {

	/** @override */
	static tag = 'span';
}
