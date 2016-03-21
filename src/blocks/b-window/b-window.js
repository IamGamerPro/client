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
		 * Opens window
		 */
		open() {
			this.block.setMod('hidden', false);
			this.$emit(`${this.$options.name}-open`);
		},

		/**
		 * Closes window
		 */
		close() {
			this.block.setMod('hidden', true);
			this.$emit(`${this.$options.name}-close`);
		}
	},

	ready() {
		let closeOnEscape;
		this.event.on('block.mod.set.hidden.false', () => {
			closeOnEscape = this.async.addNodeEventListener(document, 'keyup', (e) => {
				if (KeyCodes.ESC === e.keyCode) {
					this.close();
				}
			});
		});

		this.event.on('block.mod.set.hidden.true', () => this.async.removeNodeEventListener(closeOnEscape));
	}

}, tpls)

@block
export default class bWindow extends iBlock {}
