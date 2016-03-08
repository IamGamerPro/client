'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iPage from '../i-page/i-page';
import { block } from '../../core/block';

@block
export default class pMaster extends iPage {
	/**
	 * @override
	 */
	constructor(params?: Object = {}) {
		params.data = params.data || {};
		params.data.page = '';
		super(params);
	}
}
