'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import iInput from '../i-input/i-input';
import iBlock from '../i-block/i-block';
import * as tpls from './b-form.ss';
import { block, model } from '../../core/block';
import { request } from '../../core/request';
import { SERVER_URL } from '../../core/const/server';

@model({
	props: {
		id: {
			type: String
		},

		name: {
			type: String
		},

		action: {
			type: String
		},

		delegate: {
			type: Function
		},

		params: {
			type: Object,
			default: () => ({})
		}
	},

	computed: {
		/**
		 * The array of form Vue elements
		 */
		elements: {
			cache: false,
			get(): Array {
				return $C(this.$els.form.elements).reduce((arr, el) => {
					const
						component = this.$(el, '[class*="_form_true"]');

					if (component && component.block instanceof iInput) {
						arr.push(component);
					}

					return arr;
				}, []);
			}
		},

		/**
		 * The array of form submit Vue elements
		 */
		submits: {
			cache: false,
			get(): Array {
				return $C(
					this.$el
						.queryAll('button[type="submit"]')
						.concat(this.id ? document.queryAll(`button[type="submit"][form="${this.id}"]`) : [])

				).map((el) => this.$(el));
			}
		}
	},

	mods: {
		valid: [
			'true',
			'false'
		]
	},

	methods: {
		/**
		 * Resets child form blocks to default
		 */
		reset() {
			$C(this.elements).forEach((el) => el.reset());
		},

		/**
		 * Validates child form blocks
		 */
		async validate(): Promise<boolean> {
			this.emit('validationStart');

			let valid = true;
			for (let el of this.elements) {
				if (el.mods['valid'] !== 'true' && await el.validate() === false) {
					el.focus();
					valid = false;
					break;
				}
			}

			if (valid) {
				this.emit('validationSuccess');

			} else {
				this.emit('validationFail');
			}

			this.emit('validationEnd', valid);
			return valid;
		},

		/**
		 * Submits the form
		 */
		async submit() {
			const
				start = Date.now(),
				{submits, elements} = this;

			$C(submits).forEach((el) =>
				el.setMod('progress', true));

			let valid;
			if (valid = await this.validate()) {
				const body = $C(elements).reduce((map, el) => {
					if (el.name) {
						map[el.name] = el.formValue;
						el.setMod('disabled', true);
					}

					return map;
				}, {});

				try {
					const p = Object.assign({method: 'POST'}, this.params, {body});
					this.emit('submitStart', p);

					const req = await (
						this.delegate ? this.delegate(p) : this.async.setRequest(request(SERVER_URL + this.action, p))
					);

					this.emit('submitSuccess', req);

				} catch (err) {
					this.emit('submitFail', err);
				}
			}

			const end = () => {
				$C(elements).forEach((el) =>
					el.setMod('disabled', false));

				$C(submits).forEach((el) =>
					el.setMod('progress', false));
			};

			const delay = 0.2.second();
			if (valid && Date.now() - start < delay) {
				this.async.setTimeout(end, delay);

			} else {
				end();
			}
		}
	}

}, tpls)

@block
export default class bForm extends iBlock {}
