'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bInput from '../b-input/b-input';
import * as tpls from './b-select.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		options: {
			type: Map,
			coerce: (val) => new Map(val),
			default: () => []
		}
	},

	computed: {
		formValue() {
			const val = this.options.get(this.value);
			return val && val.value !== undefined ? val.value : val;
		}
	}

}, tpls)

@block
export default class bSelect extends bInput {}
