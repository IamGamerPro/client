'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iMessage from '../i-message/i-message';
import { block, model } from '../../core/block';

@model({
	props: {
		data: {

		},

		dataProvider: {
			type: String
		}
	}
})

@block
export default class iData extends iMessage {}
