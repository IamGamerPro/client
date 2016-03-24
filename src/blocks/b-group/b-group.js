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
import { wait } from '../i-block/i-block';
import { block, model, status } from '../../core/block';

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
		/** @override */
		async initLoad() {
			const
				opts = await this.loadSettings() || {};

			if (opts.opened) {
				this.block.setMod('opened', opts.opened);
			}
		},

		/**
		 * Opens group
		 */
		@wait(status.ready)
		open() {
			if (this.block.setMod('opened', true)) {
				this.emit('open');
			}
		},

		/**
		 * Closes group
		 */
		@wait(status.ready)
		close() {
			if (this.block.setMod('opened', false)) {
				this.emit('close');
			}
		}
	},

	created() {
		this.event.on('block.mod.set.opened.*', ({name, value}) => {
			if (this.name) {
				this.saveSettings({[name]: value});
			}
		});
	}

}, tpls)

@block
export default class bGroup extends iData {}
