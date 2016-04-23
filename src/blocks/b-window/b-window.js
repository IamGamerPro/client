'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import KeyCodes from 'js-keycodes';
import iBlock, { wait } from '../i-block/i-block';
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
		@wait('ready')
		open() {
			if (this.setMod('hidden', false)) {
				this.emit('open');
			}
		},

		/**
		 * Closes window
		 */
		@wait('ready')
		close() {
			if (this.setMod('hidden', true)) {
				this.emit('close');
			}
		}
	},

	created() {
		const closeByClick = () => {
			this.async.addNodeEventListener(document, 'keyup', {
				group: 'closeByEsc',
				fn: (e) => {
					if (e.keyCode === KeyCodes.ESC) {
						this.close();
					}
				}
			});
		};

		this.event.on('block.mod.remove.hidden.*', closeByClick);
		this.event.on('block.mod.set.hidden.false', closeByClick);
		this.event.on('block.mod.set.hidden.true', () => this.async.removeNodeEventListener({group: 'closeByEsc'}));
	}

}, tpls)

@block
export default class bWindow extends iBlock {}
