'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-avatar.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		userId: {
			type: String
		},

		dataProvider: {
			type: String,
			default: 'user'
		},

		uploader: {
			type: Object,
			required: true
		}
	},

	computed: {
		/** @override */
		requestParams(): Object {
			return {get: {id: this.userId}};
		}
	}

}, tpls)

@block
export default class bAvatar extends iData {}
