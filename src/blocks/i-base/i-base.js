/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import ss from 'snakeskin';
import uuid from '../../../bower_components/uuid';
import EventEmitter2 from 'eventemitter2';
import $C from 'collection.js';

/**
 * Decorates a method for using with state >= ready
 * @decorator
 */
export function onReady(target, key, descriptor) {
	const fn = descriptor.value;

	descriptor.value = function () {
		if (this.status[this.state] >= this.status.ready) {
			fn.call(this, ...arguments);

		} else {
			this.event.once('block.state.ready', () => fn.call(this, ...arguments));
		}
	};
}

const
	eventCache = new WeakMap(),
	nameCache = {};

/**
 * Decorates a method as a modifier handler
 *
 * @decorator
 * @param {string} name - modifier name
 * @param {string=} [opt_value] - modifier value
 */
export function mod(name, opt_value) {
	return function (target, key, descriptor) {
		const fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `block.mod.${name}.${opt_value !== undefined ? opt_value : '*'}`
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
	 * List of applied modifiers
	 * @type {Object}
	 */
	mods = null;

	/**
	 * Map of available block statuses
	 */
	status = Object.createMap({
		unload: 0,
		loading: 1,
		loaded: 2,
		ready: 3
	});

	/**
	 * @private
	 * @type {?number}
	 */
	_state = null;

	/**
	 * Sets new state to the current block
	 * @param {number} val - new block state
	 */
	set state(val) {
		this._state = val = val in this.status ? val : 0;
		this.event.emit(`block.state.${this.status[val]}`, val);
	}

	/**
	 * Return init state of the current block
	 * @returns {number}
	 */
	get state() {
		return this._state;
	}

	/**
	 * Returns a name of the current block
	 * @returns {string}
	 */
	get blockName() {
		return this.constructor.name.dasherize();
	}

	/**
	 * @param {string} [name] - block unique name
	 * @param {Object=} [tpls] - map of Snakeskin templates
	 * @param {Element=} [node] - link to a block node
	 * @param {Object=} [mod] - map of modifiers to apply
	 */
	constructor({name, tpls, node, mod} = {}) {
		this._state = this.status.unload;
		this.id = uuid.v4();

		if (name) {
			if (nameCache[name]) {
				throw new Error(`Block with name "${name}" already registered! Try another name.`);
			}

			nameCache[name] = true;
			this.name = name;
		}

		this.node = node;
		this.mods = {};
		this.event = new EventEmitter2({wildcard: true});

		if (tpls) {
			this.tpls = tpls.init(ss);
		}

		$C(this.getBlockProtoChain()).forEach((el) => {
			const fn = this[el];

			if (eventCache.has(fn)) {
				$C(eventCache.get(fn)).forEach(({event}) => this.event.on(event, fn.bind(this)));
			}

		}, {notOwn: true});

		this.state = this.status.loading;

		if (mod) {
			$C(mod).forEach((val, name) => this.setMod(name, val));
		}
	}

	/**
	 * Returns an array of property names from __proto__ of the current block
	 * @returns {Array}
	 */
	getBlockProtoChain() {
		let links = [];
		let obj = Object.getPrototypeOf(this);

		while (true) {
			links = links.concat(Object.getOwnPropertyNames(obj));

			if (obj.constructor === iBase) {
				break;
			}

			obj = Object.getPrototypeOf(obj);
		}

		return links;
	}

	/**
	 * Sets a block modifier
	 *
	 * @param {string} name - modifier name
	 * @param {string} val - modifier value
	 * @returns {!iBase}
	 */
	setMod(name, val) {
		if (this.mods[name] !== val) {
			this.mods[name] = val;
			this.node.classList.add(`${this.blockName}_${name}_${val}`);
			this.event.emit(`block.mod.${name}.${val}`);
		}

		return this;
	}

	/**
	 * Removes a block modifier
	 *
	 * @param {string} name - modifier name
	 * @param {string=} [opt_val] - modifier value
	 * @returns {!iBase}
	 */
	removeMod(name, opt_val) {
		const
			current = this.mods[name];

		if (name in this.mods && (opt_val === undefined || current === opt_val)) {
			delete this.mods[name];
			this.node.classList.remove(`${this.blockName}_${name}_${current}`);
			this.event.emit(`block.removeMod.${name}.${current}`);
		}

		return this;
	}

	/**
	 * Returns a value of the specified block modifier
	 *
	 * @param {string} name - modifier name
	 * @returns {string}
	 */
	getMod(name) {
		return this.mods[name];
	}

	/**
	 * Saves the specified block settings to the local storage
	 *
	 * @param {!Object} settings - block settings
	 * @param {string=} [opt_key] - block key
	 */
	async saveBlockSettings(settings, opt_key = '') {
		localStorage.setItem(`${this.blockName}_${this.name}_${opt_key}`, JSON.stringify(settings));
		return settings;
	}

	/**
	 * Loads block settings from the local storage
	 * @param {string=} [opt_key] - block key
	 */
	async loadBlockSettings(opt_key = '') {
		return JSON.parse(localStorage.getItem(`${this.blockName}_${this.name}_${opt_key}`));
	}
}
