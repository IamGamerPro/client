'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iDynamicPage from '../i-dynamic-page/i-dynamic-page';
import * as tpls from './p-profile.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		dataProvider: {
			type: String,
			default: 'user'
		}
	},

	computed: {
		/** @override */
		requestParams(): Object {
			return {get: {name: this.info.user}};
		}
	},

	methods: {
		/**
		 * Updates user data
		 *
		 * @param params - request parameters
		 * @param [form] - link to the form component
		 */
		async updateData(params: Object, form?: Vue) {
			try {
				await this.upd(params.body, Object.assign({label: 'updateData'}, params));
				this.data = Object.mixin(false, this.data, params.body);

			} catch (err) {
				if (form) {
					const el = form.elements[0];
					el.setMod('valid', false);
					el.errorMsg = this.getDefaultErrText(err);
					el.focus();
				}
			}
		}
	}

}, tpls)

@block
export default class pProfile extends iDynamicPage {}
