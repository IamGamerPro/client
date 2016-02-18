'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $ from 'sprint';
import ss from 'snakeskin';
import uuid from 'uuid';
import EventEmitter2 from 'eventemitter2';
import $C from 'collection.js';
import Async from '../../core/async';
import { status } from '../../core/block';

/**
 * Decorates a method for using with state >= ready
 *
 * @decorator
 * @param state - block init state
 */
export function wait(state: number) {
	return function (target, key, descriptor) {
		const fn = descriptor.value;
		descriptor.value = function () {
			if (this.state === state) {
				return;
			}

			if (this.state > state) {
				fn.call(this, ...arguments);

			} else {
				this.event.once(`block.state.${status[state]}`, () => fn.call(this, ...arguments));
			}
		};
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
 * @param [method] - event method
 */
export function mod(name: string, val?: string = '*', method?: string = 'on') {
	return function (target, key, descriptor) {
		const fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `block.mod.${name}.${val}`,
			method
		});
	};
}

/**
 * Decorates a method as a remove modifier handler
 *
 * @decorator
 * @param name - modifier name
 * @param [val] - modifier value
 * @param [method] - event method
 */
export function removeMod(name: string, val?: string = '*', method?: string = 'on') {
	return function (target, key, descriptor) {
		const fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `block.removeMod.${name}.${val}`,
			method
		});
	};
}

/**
 * Decorates a method as an event handler
 *
 * @decorator
 * @param event - event name
 * @param [method] - event method
 */
export function on(event: string, method?: string = 'on') {
	return function (target, key, descriptor) {
		const fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `block.${event}`,
			method
		});
	};
}

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
	 * If true, then initialization will be deferred
	 */
	defer: boolean = false;

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
	$$state: number = status.unloaded;

	/**
	 * Sets new state to the current block
	 * @param val - new block state
	 */
	set state(val: number) {
		this.event.emit(`block.state.${this.status[val]}`, val);
		this.$$state = val = val in this.status ? val : 0;
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
	 * @param [id] - block id
	 * @param [name] - block unique name
	 * @param [node] - link to a block node
	 * @param [tpls] - map of Snakeskin templates
	 * @param [mods] - map of modifiers to apply
	 * @param [async] - instance of Async
	 */
	constructor(
		{id, name, node, tpls, mods, async}: {
			id?: string,
			name?: string,
			node?: Element,
			tpls?: Object,
			mods?: Object,
			async?: Async
		} = {}

	) {
		this.id = id || `b-${uuid.v4()}`;
		this.async = async || new Async();

		if (name) {
			if (nameCache[name]) {
				throw new Error(`Block with name "${name}" already registered! Try another name.`);
			}

			nameCache[name] = true;
			this.name = name;
		}

		this.node = node;

		if (node) {
			this.node.classList.add('i-block-helper');
		}

		this.mods = {};
		this.event = new EventEmitter2({wildcard: true});
		this.tpls = tpls;

		if (tpls) {
			this.tpls = tpls.init(ss);
		}

		$C(this.getBlockProtoChain()).forEach((el) => {
			const fn = this[el];

			if (eventCache.has(fn)) {
				$C(eventCache.get(fn)).forEach(({event, method}) => this.event[method](event, fn.bind(this)));
			}

		}, {notOwn: true});

		this.setDefaultMods(mods);
		this.state = status.loading;
	}

	@on(status.destroyed)
	destructor() {
		this.async.clearAll();
	}

	/**
	 * Sets default modifiers to the current block
	 * @param mods - modifiers
	 */
	@wait(status.loading)
	setDefaultMods(mods: ?Object): iBase {
		$C(mods).forEach((val, name) => this.setMod(name, val));
		return this;
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
	 * Returns CSS selector for the specified element
	 *
	 * @param name - element name
	 * @param [mods] - list of modifiers
	 */
	getElSelector(name: string, ...mods?: Array<Array>): string {
		let
			sel = `.${this.blockName}__${name}`,
			res = `${sel}.${this.id}`;

		$C(mods).forEach(([name, val]) => {
			res += `${sel}_${name}_${val}`;
		});

		return res;
	}

	/**
	 * Returns list of child elements by the specified request
	 *
	 * @param name - element name
	 * @param [mods] - list of modifiers
	 */
	el(name: string, ...mods?: Array<Array>): Array<Element> {
		return $(this.node).find(this.getElSelector(name, ...mods)).dom;
	}

	/**
	 * Sets a block modifier
	 *
	 * @param name - modifier name
	 * @param val - modifier value
	 */
	setMod(name: string, val: any): iBase {
		val = String(val);

		if (this.mods[name] !== val) {
			this.removeMod(name);
			this.mods[name] = val;
			this.node.classList.add(`${this.blockName}_${name.dasherize()}_${val.dasherize()}`);
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
	removeMod(name: string, val?: any): iBase {
		const
			current = this.mods[name];

		if (name in this.mods && (val === undefined || current === String(val))) {
			delete this.mods[name];
			this.node.classList.remove(`${this.blockName}_${name.dasherize()}_${current.dasherize()}`);
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
	async saveBlockSettings(settings: Object, key?: string = '') {
		localStorage.setItem(`${this.blockName}_${this.name}_${key}`, JSON.stringify(settings));
		return settings;
	}

	/**
	 * Loads block settings from the local storage
	 * @param [key] - block key
	 */
	async loadBlockSettings(key?: string = '') {
		return JSON.parse(localStorage.getItem(`${this.blockName}_${this.name}_${key}`));
	}
}
