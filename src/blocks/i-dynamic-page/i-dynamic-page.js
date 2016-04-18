'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import { block, model } from '../../core/block';

@model({
	props: {
		info: {
			type: Object
		}
	}
})

@block
export default class iDynamicPage extends iData {}
