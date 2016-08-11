'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-group.ss';
import { wait } from '../i-block/i-block';
import { model } from '../../core/block';

@model(tpls)
export default class bGroup extends iData {
	/**
	 * Group title
	 */
	title: ?string = '';

	/** @override */
	static mods = {
		opened: [
			['true'],
			'false'
		]
	};

	/** @override */
	async initLoad() {
		const
			opts = await this.loadSettings() || {};

		if (opts.opened) {
			this.setMod('opened', opts.opened);
		}

		this.blockStatus = this.blockStatus.ready;
	}

	/**
	 * Opens group
	 */
	@wait('loading')
	open() {
		if (this.setMod('opened', true)) {
			this.emit('open');
		}
	}

	/**
	 * Closes group
	 */
	@wait('loading')
	close() {
		if (this.setMod('opened', false)) {
			this.emit('close');
		}
	}

	/** @override */
	created() {
		this.local.on('block.mod.*.opened.*', ({name, value}) => {
			if (this.blockName) {
				this.saveSettings({[name]: value});
			}
		});
	}
}

