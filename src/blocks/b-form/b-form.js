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
		elements(): Array {
			return $C(this.$els.form.elements).reduce((arr, el) => {
				const
					component = this.$(el);

				if (component.block instanceof iInput) {
					arr.push(component);
				}

				return arr;
			}, []);
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
				if (el.block.getMod('valid') !== 'true' && await el.validate() === false) {
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
			if (await this.validate()) {
				const body = $C(this.elements).reduce((map, el) => {
					if (el.name) {
						map[el.name] = el.formValue;
					}

					return map;
				}, {});

				try {
					const
						p = Object.assign({method: 'POST'}, this.params, {body}),
						req = await (this.delegate ? this.delegate(p) : this.async.setRequest(request(SERVER_URL + this.action, p)));

					this.emit('submitSuccess', req);

				} catch (err) {
					this.emit('submitFail', err);
				}
			}
		}
	}

}, tpls)

@block
export default class bForm extends iBlock {}
