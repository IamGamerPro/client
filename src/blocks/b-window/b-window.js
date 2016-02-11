'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-window.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		title: {
			type: String,
			default: ''
		}
	},

	mods: {
		hidden: [
			['true'],
			'false'
		]
	},

	methods: {
		/**
		 * Open window
		 */
		open() {
			this.block.setMod('hidden', false);
		},

		/**
		 * Close window
		 */
		close() {
			this.block.setMod('hidden', true);
		}
	}

}, tpls)

@block
export default class bWindow extends iBlock {}
