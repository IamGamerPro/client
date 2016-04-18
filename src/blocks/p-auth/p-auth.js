'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { parse } from 'qs';
import iPage from '../i-page/i-page';
import { block } from '../../core/block';

@block
export default class pAuth extends iPage {

	/* @override */
	component() {
		const
			{from} = parse(location.search.slice(1));

		return {
			methods: {
				/**
				 * Login handler
				 *
				 * @param el
				 * @param req
				 */
				onLoginSuccess(el: Vue, req: XMLHttpRequest) {
					localStorage.setItem('jwt', req.getResponseHeader('X-JWT-TOKEN'));
					localStorage.setItem('xsrf', req.getResponseHeader('X-XSRF-TOKEN'));
					location.href = from || `/${req.requestData.login}`;
				}
			},

			mixins: [super.component()]
		};
	}
}
