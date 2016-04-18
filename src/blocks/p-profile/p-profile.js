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

	methods: {
		/** @override */
		getParams(): Array {
			return [{name: this.info.user}];
		}
	}

}, tpls)

@block
export default class pProfile extends iDynamicPage {}
