'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import { PARENT_MODS } from '../i-block/i-block';
import * as tpls from './b-button.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		type: {
			type: String,
			default: 'button'
		},

		form: {
			type: String
		},

		preIcon: {
			type: String
		},

		icon: {
			type: String
		},

		title: {
			type: String
		}
	},

	mods: {
		theme: [
			PARENT_MODS,
			'dark',
			'dark-form',
			'dark-link',
			'dark-pseudo-link',
			'link',
			'pseudo-link'
		]
	}

}, tpls)

@block
export default class bButton extends iData {}
