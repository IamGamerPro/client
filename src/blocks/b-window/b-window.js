'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-window.ss';
import keyCodes from '../../core/keyCodes';
import { field, wait } from '../i-block/i-block';
import { model } from '../../core/block';

@model(tpls)
export default class bWindow extends iData {
	/**
	 * Initial window title
	 */
	initTitle: ?string;

	/**
	 * Window title
	 */
	@field((o) => o.initTitle)
	title: ?string;

	/** @override */
	static mods: {
		hidden: [
			['true'],
			'false'
		]
	};

	/** @override */
	$$stage(value, oldValue) {
		this.async.clearAll({group: `stage.${oldValue}`});
	}

	/** @override */
	$$errorMsg(value) {
		if (value) {
			this.stage = 'error';
		}
	}

	/**
	 * Error handler
	 * @param err
	 */
	onError(err: Error) {
		this.error = this.getDefaultErrText(err);
	}

	/**
	 * Opens window
	 * @param [stage]
	 */
	@wait('loading')
	async open(stage?: string) {
		if (this.setMod('hidden', false)) {
			if (stage) {
				this.stage = stage;
			}

			await this.nextTick();
			this.emit('open');
		}
	}

	/**
	 * Closes window
	 */
	@wait('loading')
	close() {
		if (this.setMod('hidden', true)) {
			this.emit('close');
		}
	}

	/** @override */
	created() {
		const closeByClick = () => {
			this.async.addNodeEventListener(document, 'keyup', {
				group: 'closeByEsc',
				fn: (e) => {
					if (e.keyCode === keyCodes.ESC) {
						this.close();
					}
				}
			});
		};

		this.local.on('block.mod.remove.hidden.*', closeByClick);
		this.local.on('block.mod.set.hidden.false', closeByClick);
		this.local.on('block.mod.set.hidden.true', () => this.async.removeNodeEventListener({group: 'closeByEsc'}));
	}

	/** @override */
	mounted() {
		document.body.prepend(this.$el);
	}
}
