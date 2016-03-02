'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-router.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		status: {
			type: Number,
			default: 0
		}
	}

}, tpls)

@block
export default class bRouter extends iData {}
