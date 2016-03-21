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
	defer: true,
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
		 * Opens group
		 */
		open() {
			this.block.setMod('opened', true);
			this.$emit(`${this.$options.name}-open`);
		},

		/**
		 * Closes group
		 */
		close() {
			this.block.setMod('opened', false);
			this.$emit(`${this.$options.name}-close`);
		}
	},

	ready() {
		void async () => {
			const
				opts = await this.loadSettings() || {};

			if (opts.opened) {
				this.block.setMod('opened', opts.opened);
			}
		}();

		this.event.on('block.mod.set.opened.*', ({name, value}) => {
			if (this.name) {
				this.saveSettings({[name]: value});
			}
		});
	}

}, tpls)

@block
export default class bGroup extends iData {}
