'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import { wait, mixin, $watch } from '../i-block/i-block';
import { block, model, status } from '../../core/block';

@model({
	tag: 'span',
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

	/**
	 * Block validators
	 */
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
		 * @param newValue
		 * @param oldValue
		 */
		cache(newValue: any, oldValue: any) {
			this.$set('prevValue', oldValue || '');
		},

		/**
		 * Returns default texts for server errors
		 * @param err
		 */
		getDefaultErrText(err: Object): string {
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
		 * Resets the current block value to default
		 */
		@wait(status.ready)
		reset() {
			this.reseting = true;
			this.value = this.defaultValue;
			this.async.clearAll({group: 'validation'});
			this.block.removeMod('valid');
			this.$emit(`${this.$options.name}-reset`);
		},

		/**
		 * Validates the current block value
		 * @param params - additional parameters
		 */
		@wait(status.ready)
		async validate(params): Promise<boolean> {
			if (!this.validators.length || this.reseting) {
				this.reseting = false;
				this.block.removeMod('valid');
				return true;
			}

			this.$emit(`${this.$options.name}-validationStart`);
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
		this.event.on('block.mod.remove.valid.*', () => this.errorMsg = undefined);
	}

})

@block
export default class iInput extends iData {}
