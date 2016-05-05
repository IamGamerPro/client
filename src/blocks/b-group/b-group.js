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
		/** @override */
		async initLoad() {
			const
				opts = await this.loadSettings() || {};

			if (opts.opened) {
				this.setMod('opened', opts.opened);
			}

			this.blockStatus = this.blockStatus.ready;
		},

		/**
		 * Opens group
		 */
		@wait('loading')
		open() {
			if (this.setMod('opened', true)) {
				this.emit('open');
			}
		},

		/**
		 * Closes group
		 */
		@wait('loading')
		close() {
			if (this.setMod('opened', false)) {
				this.emit('close');
			}
		}
	},

	created() {
		this.event.on('block.mod.*.opened.*', ({name, value}) => {
			if (this.name) {
				this.saveSettings({[name]: value});
			}
		});
	}

}, tpls)

@block
export default class bGroup extends iData {}
