/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import ss from 'snakeskin';
import uuid from 'uuid';
import event from 'eventemitter2';

export function onReady(target, key, descriptor) {
	const fn = descriptor.value;
	descriptor.value = function () {
		this.event.on('ready', () => {
			fn.call(this, ...arguments);
		});
	};
}

export default class iBase {
	/**
	 * Block unique ID
	 * @type {?string}
	 */
	id = null;

	/**
	 * Link to a block node
	 * @type {Element}
	 */
	node = null;

	/**
	 * Event emitter
	 * @type {eventemitter2.EventEmitter2}
	 */
	event = null;

	/**
	 * @param {Object=} [tpls] - map of Snakeskin templates
	 * @param {Element=} [node] - link to a block node
	 */
	constructor({tpls, node}) {
		this.node = node;
		this.id = uuid.v4();
		this.event = new event.EventEmitter2({wildcard: true});

		if (tpls) {
			this.tpls = tpls.init(ss);
		}
	}

	/**
	 * Returns a name of the current block
	 * @returns {string}
	 */
	get blockName() {
		return this.constructor.name;
	}

	/**
	 * Saves the specified block settings to the local storage
	 *
	 * @param {!Object} settings - block settings
	 * @param {string=} [opt_key] - block key
	 */
	async saveBlockSettings(settings, opt_key = '') {
		localStorage.setItem(`${this.blockName}_${opt_key}`, JSON.stringify(settings));
		return settings;
	}

	/**
	 * Loads block settings from the local storage
	 * @param {string=} [opt_key] - block key
	 */
	async loadBlockSettings(opt_key = '') {
		return localStorage.getItem(`${this.blockName}_${opt_key}`);
	}
}
