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
		},

		data: {
			type: Object
		}
	},

	mods: {
		valid: [
			'true',
			'false'
		]
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

	methods: {
		/**
		 * Resets child form blocks to default
		 */
		reset() {
			$C(this.elements).forEach((el) => el.reset());
		},

		/**
		 * Validates child form blocks
		 * and returns an array of valid elements or false
		 */
		async validate(): Array | boolean {
			this.emit('validationStart');

			const
				els = [],
				map = {};

			let valid = true;
			for (let el of this.elements) {
				let
					data = this.$get(`data.${el.name}`);

				if (el.converter) {
					data = el.converter(data);
				}

				if (
					el.name &&
					!Object.equal(this.$get(`data.${el.name}`), el.groupFormValue)
				) {
					if (el.mods.valid !== 'true' && await el.validate() === false) {
						el.focus();
						valid = false;
						break;
					}

					map[el.name] = true;
					els.push(el);
				}
			}

			if (valid) {
				this.emit('validationSuccess');

			} else {
				this.emit('validationFail');
			}

			this.emit('validationEnd', valid);
			return valid && els;
		},

		/**
		 * Submits the form
		 */
		async submit() {
			const
				start = Date.now(),
				{submits, elements} = this;

			$C(elements).forEach((el) =>
				el.setMod('disabled', true));

			$C(submits).forEach((el) =>
				el.setMod('progress', true));

			let els;
			if (els = await this.validate()) {
				if (els.length) {
					const
						body = $C(els).reduce((map, el) => (map[el.name] = el.groupFormValue, map), {}),
						p = Object.assign({method: 'POST'}, this.params, {body});

					this.emit('submitStart', p);
					try {
						const req = await (
							this.delegate ? this.delegate(p) : this.async.setRequest(request(SERVER_URL + this.action, p))
						);

						this.data = Object.mixin(false, this.data, body);
						this.emit('submitSuccess', req);

					} catch (err) {
						this.emit('submitFail', err);
						throw err;
					}
				}
			}

			const
				delay = 0.2.second();

			if (els && Date.now() - start < delay) {
				await this.async.sleep(delay);
			}

			$C(elements).forEach((el) =>
				el.setMod('disabled', false));

			$C(submits).forEach((el) =>
				el.setMod('progress', false));
		}
	}

}, tpls)

@block
export default class bForm extends iBlock {}
