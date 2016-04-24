'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import pProfile from '../p-profile/p-profile';
import * as tpls from './p-profile-options.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		tabs: {
			type: Object,
			default: () => ({})
		}
	}

}, tpls)
@block
export default class pProfileOptions extends pProfile {}
