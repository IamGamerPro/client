'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import { field, wait } from '../i-block/i-block';
import { model } from '../../core/block';

const
	$C = require('collection.js');

@model()
export default class iInput extends iData {
	/**
	 * Initial block value
	 */
	initValue: ?any;

	/**
	 * Block default value
	 */
	default: ?any;

	/**
	 * Block value converter
	 */
	converter: ?Function;

	/**
	 * Input id
	 */
	id: ?string;

	/**
	 * Input name
	 */
	name: ?string;

	/**
	 * Connected form id
	 */
	form: ?string;

	/**
	 * Block value type factory
	 */
	dataType: ?Function = String;

	/**
	 * List of validators
	 */
	validators: Array = [];

	/**
	 * Block value store
	 */
	@field((o) => o.initValue)
	valueStore: any;

	/**
	 * Previous block value
	 */
	@field()
	prevValue: any;

	/**
	 * Block value synchronization
	 */
	$$valueStore(newValue: any, oldValue: any) {
		this.prevValue = oldValue;
		this.validate();
	}

	/** @override */
	static mods = {
		form: [
			['true'],
			'false'
		],

		valid: [
			'true',
			'false'
		]
	};

	/**
	 * Block validators
	 */
	static validators = {
		/** @this {iInput} */
		required({msg, showMsg = true}): boolean {
			if (!this.formValue) {
				if (showMsg) {
					this.error = msg || i18n`Обязательное поле`;
				}

				return false;
			}

			return true;
		}
	};

	/** @override */
	get error() {
		return this.errorMsg && this.errorMsg.replace(/\.$/, '');
	}

	/**
	 * Link to the form that is associated to the block
	 */
	get connectedForm(): ?HTMLFormElement {
		return this.form ? document.querySelector(`#${this.form}`) : this.$el.closest('form');
	}

	/**
	 * Block value
	 */
	get value(): any {
		return this.valueStore;
	}

	/**
	 * Sets a new block value
	 */
	set value(value: any) {
		this.valueStore = value;
	}

	/**
	 * Block default value
	 */
	get defaultValue(): any {
		return this.default;
	}

	/**
	 * Form value of the block
	 */
	get formValue(): any {
		return this.dataType(this.value);
	}

	/**
	 * Grouped form value of the block
	 */
	get groupFormValue(): any {
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
	}

	/**
	 * Validates the current block value
	 * @param params - additional parameters
	 */
	@wait('ready')
	async validate(params?: Object): boolean {
		if (!this.validators.length || this.reseting) {
			this.reseting = false;
			this.removeMod('valid');
			return true;
		}

		this.emit('validationStart');
		let valid;

		for (const el of this.validators) {
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

	/** @override */
	created() {
		this.local.on('block.mod.remove.valid.*', () => this.errorMsg = undefined);
	}
}

