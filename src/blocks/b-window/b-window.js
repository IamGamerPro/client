'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import KeyCodes from 'js-keycodes';
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
			this.$emit('open');
		},

		/**
		 * Close window
		 */
		close() {
			this.block.setMod('hidden', true);
			this.$emit('close');
		}
	},

	ready() {
		let closeOnEscape;
		this.block.event.on('block.mod.hidden.false', () => {
			closeOnEscape = this.async.addNodeEventListener(document, 'keyup', (e) => {
				if (KeyCodes.ESC === e.keyCode) {
					this.close();
				}
			});
		});

		this.block.event.on('block.mod.hidden.true', () => this.async.removeNodeEventListener(closeOnEscape));
	}

}, tpls)

@block
export default class bWindow extends iBlock {}
