'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './i-list.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		list: {
			type: Array,
			default: () => []
		},

		preIcon: {
			type: String
		},

		icon: {
			type: String
		}
	}
}, tpls)

@block
export default class iList extends iData {}
