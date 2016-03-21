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
import * as tpls from './b-link.ss';
import { block, model } from '../../core/block';

@model({
	tag: 'span',
	props: {
		href: {
			type: String,
			default: '#'
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
			'light',
			'light-form',
			'danger'
		]
	}

}, tpls)

@block
export default class bLink extends iData {}
