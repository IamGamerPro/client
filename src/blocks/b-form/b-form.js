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
			return $C(this[':form'].elements).reduce((arr, el) => {
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
		validate(): boolean {
			return $C(this.elements).every((el) => {
				const
					status = el.validate();

				if (!status) {
					el.focus();
				}

				return status;
			});
		},

		/**
		 * Submits the form
		 */
		submit() {
			if (this.validate()) {
				const values = $C(this.elements).reduce((arr, el) => {
					if (el.name) {
						arr.push({[el.name]: el.primitiveValue});
					}

					return arr;
				}, []);
			}
		}
	}

}, tpls)

@block
export default class bForm extends iBlock {}
