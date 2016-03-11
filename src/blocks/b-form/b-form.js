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
import { c } from '../../core/request';
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
			type: String,
			required: true
		},

		method: {
			type: String,
			default: 'POST'
		}
	},

	computed: {
		/**
		 * Returns an array of form Vue elements
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
		 * Resets form components to default value
		 */
		reset() {
			$C(this.elements).forEach((el) => {
				el.reset();
			});
		},

		/**
		 * Validates form components
		 */
		async validate(): Promise<boolean> {
			for (let el of this.elements) {
				if (el.block.getMod('valid') !== 'true' && await el.validate() === false) {
					el.focus();
					return false;
				}
			}

			return true;
		},

		/**
		 * Submits the form
		 */
		async submit() {
			if (await this.validate()) {
				const values = $C(this.elements).reduce((map, el) => {
					if (el.name) {
						map[el.name] = el.primitiveValue;
					}

					return map;
				}, {});

				const {response} = await this.async.setRequest(c(SERVER_URL + this.action, values));
				console.log(response);
			}
		}
	}

}, tpls)

@block
export default class bForm extends iBlock {}
