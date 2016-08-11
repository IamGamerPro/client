'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iInput from '../i-input/i-input';
import iBlock, { params } from '../i-block/i-block';
import * as tpls from './b-form.ss';
import { model } from '../../core/block';
import { request } from '../../core/request';

const
	$C = require('collection.js');

@model(tpls)
export default class bForm extends iBlock {
	/**
	 * Form id
	 */
	id: ?string;

	/**
	 * Form name
	 */
	name: ?string;

	/**
	 * Form action
	 */
	action: ?string;

	/**
	 * Form delegate function
	 */
	delegate: ?Function;

	/**
	 * Form request parameters
	 */
	params: Object = {};

	/** @override */
	$refs(): {form: HTMLFormElement} {}

	/** @override */
	static mods = {
		valid: [
			'true',
			'false'
		]
	};

	/**
	 * Resets child form blocks to default
	 */
	reset() {
		$C(this.elements).forEach((el) => el.reset());
	}

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
		for (const el of this.elements) {
			let data = this.getField(`db.${el.name}`);

			if (el.converter) {
				data = el.converter(data);
			}

			if (el.name && !Object.equal(data, el.groupFormValue)) {
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
	}

	/**
	 * The array of form Vue elements
	 */
	@params({cache: false})
	get elements(): Array<iInput> {
		return $C(this.$refs.form.elements).reduce((arr, el) => {
			const
				component = this.$(el, '[class*="_form_true"]');

			if (component && component.instance instanceof iInput) {
				arr.push(component);
			}

			return arr;
		}, []);
	}

	/**
	 * The array of form submit Vue elements
	 */
	@params({cache: false})
	get submits(): Array<bButton> {
		return $C(
			this.$el
				.queryAll('button[type="submit"]')
				.concat(this.id ? document.queryAll(`button[type="submit"][form="${this.id}"]`) : [])

		).map((el) => this.$(el));
	}

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

		const
			els = await this.validate();

		if (els) {
			if (els.length) {
				const
					body = $C(els).reduce((map, el) => (map[el.name] = el.groupFormValue, map), {}),
					p = Object.assign({method: 'POST'}, this.params, {body});

				this.emit('submitStart', p);
				try {
					const req = await (
						this.delegate ? this.delegate(p, els[0], this) : this.async.setRequest(request(this.action, p))
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

