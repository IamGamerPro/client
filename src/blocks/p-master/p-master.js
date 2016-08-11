'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iPage from '../i-page/i-page';
import { block } from '../../core/block';

@block
export default class pMaster extends iPage {

	/** @override */
	constructor(params?: Object = {}) {
		params.data = params.data || {};
		params.data.pageInfo = {};
		params.data.pageData = null;
		super(params);
	}
}
