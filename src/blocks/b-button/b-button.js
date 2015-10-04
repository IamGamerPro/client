/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { block } from '../../core/block';
import iBlock from '../i-block/i-block';
import * as tpls from './b-button.ss';

@block({
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

export default class bButton extends iBlock {}
