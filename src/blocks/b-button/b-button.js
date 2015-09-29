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

@block('b-button', {
	props: {
		label: {
			type: String,
			required: true
		}
	}

}, tpls)

export default class bButton extends iBlock {}
