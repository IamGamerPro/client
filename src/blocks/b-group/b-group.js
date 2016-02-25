'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-group.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		title: {
			type: String,
			default: ''
		}
	},

	mods: {
		opened: [
			['true'],
			'false'
		]
	},

	methods: {
		/**
		 * Open group
		 */
		open() {
			this.block.setMod('opened', true);
		},

		/**
		 * Close group
		 */
		close() {
			this.block.setMod('opened', false);
		}
	}

}, tpls)

@block
export default class bGroup extends iData {}
