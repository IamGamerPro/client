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
export default class pAuth extends iPage {

	/* @override */
	component() {
		return {
			methods: {
				onRegistrationSuccess(el, req) {
					console.log(req);
				},

				onLoginSuccess(el, req) {
					console.log(req);
				}
			},

			mixins: [super.component()]
		};
	}
}
