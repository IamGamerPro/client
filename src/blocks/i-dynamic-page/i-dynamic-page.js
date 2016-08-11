'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import { params } from '../i-block/i-block';
import { model } from '../../core/block';

@model()
export default class iDynamicPage extends iData {
	/**
	 * Page info
	 */
	pageInfo: ?Object;

	/**
	 * Data synchronization
	 */
	@params({immediate: true})
	$$db(value: Object) {
		this.$root.pageData = value;
	}
}
