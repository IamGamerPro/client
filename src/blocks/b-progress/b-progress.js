'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock, { PARENT_MODS, bindToParam } from '../i-block/i-block';
import * as tpls from './b-progress.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		value: {
			type: Number,
			default: 0
		}
	},

	mods: {
		@bindToParam('value')
		progress: [
			PARENT_MODS
		]
	}

}, tpls)

@block
export default class bProgress extends iBlock {}
