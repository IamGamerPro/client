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
import { wait, mixin, $watch } from '../i-block/i-block';
import { block, model } from '../../core/block';

@model({
	tag: 'span',
	props: {
		@$watch('cache', {immediate: true})
		@$watch('validate')
		value: {},
		defaultValue: {},

		converter: {
			type: Function
		},

		id: {
			type: String
		},

		name: {
			type: String
		},

		form: {
			type: String
		},

		dataType: {
			type: Function,
			default: String
		},

		validators: {
			type: Array,
			default: () => []
		},

		errorMsg: {
			type: String,
			coerce: (val) => val && val.replace(/\.$/, '')
		}
	},

	mods: {
		form: [
			['true'],
			'false'
		],

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
			if (!this.formValue) {
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
		 * Returns a link to the form that is associated to the current block
		 */
		connectedForm(): ?HTMLFormElement {
			return this.form ? document.querySelector(`#${this.form}`) : this.$el.closest('form');
		},

		/**
		 * Returns the form value of the current block
		 */
		formValue() {
			return this.dataType(this.value);
		},

		/**
		 * Returns the grouped form value of the current block
		 */
		groupFormValue() {
			if (this.name) {
				const form = this.connectedForm;
				const els = $C(document.getElementsByName(this.name)).reduce((arr, el) => {
					el = this.$(el, '[class*="_form_true"]');

					if (el && form === el.connectedForm) {
						arr.push(el.formValue);
					}

					return arr;
				}, []);

				return els.length > 1 ? els : els[0];
			}

			return this.formValue;
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
		 * Resets the current block value to default
		 */
		@wait('ready')
		reset() {
			if (this.value !== this.defaultValue) {
				this.reseting = true;
				this.value = this.defaultValue;
				this.async.clearAll({group: 'validation'});
				this.removeMod('valid');
				this.emit('reset');
			}
		},

		/**
		 * Validates the current block value
		 * @param params - additional parameters
		 */
		@wait('ready')
		async validate(params): boolean {
			if (!this.validators.length || this.reseting) {
				this.reseting = false;
				this.removeMod('valid');
				return true;
			}

			this.emit('validationStart');
			let valid;

			for (let el of this.validators) {
				const
					key = Object.isString(el) ? el : Object.keys(el)[0];

				const validator = this.$options.validators[key].call(
					this,
					Object.assign(Object.isObject(el) ? el[key] : {}, params)
				);

				if (validator instanceof Promise) {
					this.removeMod('valid');
					this.setMod('progress', true);
				}

				valid = await validator;
				if (!valid) {
					break;
				}
			}

			this.setMod('progress', false);

			if (Object.isBoolean(valid)) {
				this.setMod('valid', valid);

			} else {
				this.removeMod('valid', valid);
			}

			if (valid) {
				this.emit('validationSuccess');

			} else {
				this.emit('validationFail');
			}

			this.emit('validationEnd', valid);
			return valid;
		}
	},

	created() {
		this.event.on('block.mod.remove.valid.*', () => this.errorMsg = undefined);
	}

})

@block
export default class iInput extends iData {}
