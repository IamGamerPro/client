/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-button.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		value: {
			type: String,
			required: true
		},

		type: {
			type: String,
			default: 'button'
		},

		form: {
			type: String
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
export default class bButton extends iBlock {}
