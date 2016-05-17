'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import KeyCodes from 'js-keycodes';
import iData from '../i-data/i-data';
import * as tpls from './b-window.ss';
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
		hidden: [
			['true'],
			'false'
		]
	},

	watch: {
		stage(val, oldVal) {
			this.async.clearAll({group: `stage.${oldVal}`});
		},

		errorMsg(val) {
			if (val) {
				this.stage = 'error';
			}
		}
	},

	methods: {
		/**
		 * Error handler
		 * @param err
		 */
		onError(err: Error) {
			this.errorMsg = this.getDefaultErrText(err);
		},

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
		},

		/**
		 * Closes window
		 */
		@wait('loading')
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
	},

	ready() {
		document.body.prepend(this.$el);
	}

}, tpls)

@block
export default class bWindow extends iData {}
