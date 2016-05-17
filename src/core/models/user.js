'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { SERVER_URL } from '../const/server';
import Provider, { provider } from '../data';

@provider
export default class User extends Provider {

	/** @override */
	baseURL = `${SERVER_URL}private/user`;
}
