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
		 * @param params - request parameters
		 */
		async updateData(params) {
			try {
				await this.async.setRequest({
					label: 'update',
					req: this.$$dataProvider.upd(params.body, params)
				});

				this.data = Object.mixin(false, this.data, params.body);

			} catch (err) {
			}
		}
	}

}, tpls)

@block
export default class pProfile extends iDynamicPage {}
