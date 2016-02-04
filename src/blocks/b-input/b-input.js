'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-input.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		value: {
			type: String
		},

		type: {
			type: String,
			default: 'text'
		},

		id: {
			type: String
		},

		name: {
			type: String
		},

		placeholder: {
			type: String
		},

		autocomplete: {
			type: String
		},

		autofocus: {
			type: String
		}
	}

}, tpls)

@block
export default class bInput extends iData {}
