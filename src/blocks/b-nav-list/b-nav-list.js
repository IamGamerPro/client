'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-nav-list.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		value: {
			type: Array,
			default: () => []
		}
	}
}, tpls)

@block
export default class bNavList extends iData {}
