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
 * @param name - modifier name
 * @param [val] - modifier value
 */
export function mod(name: string, val: ?string) {
	return function (target, key, descriptor) {
		const fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `block.mod.${name}.${val !== undefined ? val : '*'}`
		});
	};
}

const status = Object.createMap({
	unload: 0,
	loading: 1,
	loaded: 2,
	ready: 3
});

export default class iBase {

	/**
	 * Block unique ID
	 */
	id: ?string;

	/**
	 * Link to a block node
	 */
	node: ?Element;

	/**
	 * Event emitter
	 */
	event: ?EventEmitter2;

	/**
	 * List of applied modifiers
	 */
	mods: ?Object;

	/**
	 * Map of available block statuses
	 */
	status = status;

	/**
	 * Block init state
	 * @protected
	 */
	$$state: number = status.unload;

	/**
	 * Sets new state to the current block
	 * @param val - new block state
	 */
	set state(val: number) {
		this.$$state = val = val in this.status ? val : 0;
		this.event.emit(`block.state.${this.status[val]}`, val);
	}

	/**
	 * Return init state of the current block
	 */
	get state(): number {
		return this.$$state;
	}

	/**
	 * Returns a name of the current block
	 */
	get blockName(): string {
		return this.constructor.name.dasherize();
	}

	/**
	 * @param [name] - block unique name
	 * @param [node] - link to a block node
	 * @param [tpls] - map of Snakeskin templates
	 * @param [mods] - map of modifiers to apply
	 */
	constructor({name, node, tpls, mods}: {name: ?string, node: ?Element, tpls: ?Object, mod: ?Object} = {}) {
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

		if (mods) {
			$C(mods).forEach((val, name) => this.setMod(name, val));
		}
	}

	/**
	 * Returns an array of property names from __proto__ of the current block
	 */
	getBlockProtoChain(): Array {
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
	 * @param name - modifier name
	 * @param val - modifier value
	 */
	setMod(name: string, val: string): iBase {
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
	 * @param name - modifier name
	 * @param [val] - modifier value
	 */
	removeMod(name: string, val: ?string): iBase {
		const
			current = this.mods[name];

		if (name in this.mods && (val === undefined || current === val)) {
			delete this.mods[name];
			this.node.classList.remove(`${this.blockName}_${name}_${current}`);
			this.event.emit(`block.removeMod.${name}.${current}`);
		}

		return this;
	}

	/**
	 * Returns a value of the specified block modifier
	 * @param name - modifier name
	 */
	getMod(name: string): string {
		return this.mods[name];
	}

	/**
	 * Saves the specified block settings to the local storage
	 *
	 * @param settings - block settings
	 * @param [key] - block key
	 */
	async saveBlockSettings(settings: Object, key: ?string = '') {
		localStorage.setItem(`${this.blockName}_${this.name}_${key}`, JSON.stringify(settings));
		return settings;
	}

	/**
	 * Loads block settings from the local storage
	 * @param [key] - block key
	 */
	async loadBlockSettings(key: ?string = '') {
		return JSON.parse(localStorage.getItem(`${this.blockName}_${this.name}_${key}`));
	}
}
