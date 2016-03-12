'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import uuid from 'uuid';
import localforage from 'localforage';
import EventEmitter2 from 'eventemitter2';
import $C from 'collection.js';
import Async from '../../core/async';
import { status } from '../../core/block';

/**
 * Decorates a method for using with the specified state
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
 * @param [value] - modifier value
 * @param [method] - event method
 */
export function mod(name: string, value?: any = '*', method?: string = 'on') {
	return function (target, key, descriptor) {
		const
			fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `block.mod.set.${name}.${value}`,
			method
		});
	};
}

/**
 * Decorates a method as a remove modifier handler
 *
 * @decorator
 * @param name - modifier name
 * @param [value] - modifier value
 * @param [method] - event method
 */
export function removeMod(name: string, value?: any = '*', method?: string = 'on') {
	return function (target, key, descriptor) {
		const
			fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `block.mod.remove.${name}.${value}`,
			method
		});
	};
}

/**
 * Decorates a method as an element modifier handler
 *
 * @decorator
 * @param el - element name
 * @param name - modifier name
 * @param [value] - modifier value
 * @param [method] - event method
 */
export function elMod(el: string, name: string, value?: any = '*', method?: string = 'on') {
	return function (target, key, descriptor) {
		const
			fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `el.mod.set.${el}.${name}.${value}`,
			method
		});
	};
}

/**
 * Decorates a method as an element remove modifier handler
 *
 * @decorator
 * @param el - element name
 * @param name - modifier name
 * @param [value] - modifier value
 * @param [method] - event method
 */
export function removeElMod(el: string, name: string, value?: any = '*', method?: string = 'on') {
	return function (target, key, descriptor) {
		const
			fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `el.mod.remove.${el}.${name}.${value}`,
			method
		});
	};
}

/**
 * Decorates a method as a state handler
 *
 * @decorator
 * @param state - source state
 * @param [method] - event method
 */
export function state(state: number, method?: string = 'on') {
	return function (target, key, descriptor) {
		const
			fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({
			event: `block.state.${state}`,
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
		const
			fn = descriptor.value;

		if (!eventCache.has(fn)) {
			eventCache.set(fn, []);
		}

		eventCache.get(fn).push({event, method});
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
	 *  List of applied element modifiers
	 */
	elMods: ?WeakMap;

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
	 * @param value - new block state
	 */
	set state(value: number) {
		this.event.emit(`block.state.${this.status[value]}`, value);
		this.$$state = value = value in this.status ? value : 0;
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
			this.node.classList.add(this.blockName, 'i-block-helper');
		}

		this.mods = {};
		this.elMods = new WeakMap();
		this.event = new EventEmitter2({wildcard: true});
		this.tpls = tpls;

		$C(this.getBlockProtoChain()).forEach((el) => {
			const fn = this[el];

			if (eventCache.has(fn)) {
				$C(eventCache.get(fn)).forEach(({event, method}) => this.event[method](event, fn.bind(this)));
			}

		}, {notOwn: true});

		this.setDefaultMods(mods);
		this.state = status.loading;
	}

	@state(status.destroyed)
	destructor() {
		this.async.clearAll();
	}

	/**
	 * Sets default modifiers to the current block
	 * @param mods - map of modifiers
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
	 * Returns a full name of the block
	 *
	 * @param [modName] - modifier name
	 * @param [modVal] - modifier value
	 */
	getFullBlockName(modName?: string, modVal?: any): string {
		return this.blockName + (modName ? `_${modName.dasherize()}_${String(modVal).dasherize()}` : '');
	}

	/**
	 * Returns a full name of the specified element
	 *
	 * @param name - element name
	 * @param [modName] - modifier name
	 * @param [modVal] - modifier value
	 */
	getFullElName(name: string, modName?: string, modVal?: any): string {
		const modStr = modName ? `_${modName.dasherize()}_${String(modVal).dasherize()}` : '';
		return `${this.blockName}__${name.dasherize()}${modStr}`;
	}

	/**
	 * Returns CSS selector for the specified element
	 *
	 * @param name - element name
	 * @param [mods] - list of modifiers
	 */
	getElSelector(name: string, ...mods?: Array<Array>): string {
		const sel = `.${this.getFullElName(name)}`;
		return $C(mods).reduce((res, [name, val]) => `${res}${sel}_${name}_${val}`, `${sel}.${this.id}`);
	}

	/**
	 * Returns list of child elements by the specified request
	 *
	 * @param name - element name
	 * @param [mods] - list of modifiers
	 */
	elements(name: string, ...mods?: Array<Array>): Array<Element> {
		return this.node.queryAll(this.getElSelector(name, ...mods));
	}

	/**
	 * Sets a block modifier
	 *
	 * @param name - modifier name
	 * @param value - modifier value
	 */
	setMod(name: string, value: any): iBase {
		value = String(value);

		if (this.mods[name] !== value) {
			this.removeMod(name);
			this.mods[name] = value;
			this.node.classList.add(this.getFullBlockName(name, value));
			this.event.emit(`block.mod.set.${name}.${value}`, {
				event: 'block.mod.set',
				name,
				value
			});
		}

		return this;
	}

	/**
	 * Removes a block modifier
	 *
	 * @param name - modifier name
	 * @param [value] - modifier value
	 */
	removeMod(name: string, value?: any): iBase {
		const
			current = this.mods[name];

		if (name in this.mods && (value === undefined || current === String(value))) {
			delete this.mods[name];
			this.node.classList.remove(this.getFullBlockName(name, current));
			this.event.emit(`block.mod.remove.${name}.${current}`, {
				event: 'block.mod.remove',
				name,
				value: current
			});
		}

		return this;
	}

	/**
	 * Returns a value of the specified block modifier
	 * @param name - modifier name
	 */
	getMod(name: string): ?string {
		return this.mods[name];
	}

	/**
	 * Sets a modifier to the specified element
	 *
	 * @param link - link to the element
	 * @param el - element name
	 * @param name - modifier name
	 * @param value - modifier value
	 */
	setElMod(link: Element, el: string, name: string, value: any): iBase {
		value = String(value);

		const rootMods = this.elMods.get(link) || {};
		this.elMods.set(link, rootMods);

		const
			key = el.dasherize(),
			mods = rootMods[key] = rootMods[key] || {};

		if (mods[name] !== value) {
			this.removeElMod(link, el, name);
			mods[name] = value;
			link.classList.add(this.getFullElName(el, name, value));
			this.event.emit(`el.mod.set.${el}.${name}.${value}`, {
				element: el,
				event: 'el.mod.set',
				link,
				name,
				value
			});
		}

		return this;
	}

	/**
	 * Removes a modifier from the specified element
	 *
	 * @param link - link to the element
	 * @param el - element name
	 * @param name - modifier name
	 * @param [value] - modifier value
	 */
	removeElMod(link: Element, el: string, name: string, value?: any): iBase {
		const rootMods = this.elMods.get(link) || {};
		this.elMods.set(link, rootMods);

		const
			key = el.dasherize(),
			mods = rootMods[key] = rootMods[key] || {},
			current = mods[name];

		if (name in mods && (value === undefined || current === String(value))) {
			delete mods[name];
			link.classList.remove(this.getFullElName(el, name, current));
			this.event.emit(`el.mod.remove.${el}.${name}.${current}`, {
				element: el,
				event: 'el.mod.remove',
				link,
				name,
				value: current
			});
		}

		return this;
	}

	/**
	 * Returns a value of a modifier from the specified element
	 *
	 * @param link - link to the element
	 * @param el - element name
	 * @param name - modifier name
	 */
	getElMod(link: Element, el: string, name: string): ?string {
		return ((this.elMods.get(link) || {})[el.dasherize()] || {})[name];
	}

	/**
	 * Saves the specified block settings to the local storage
	 *
	 * @param settings - block settings
	 * @param [key] - block key
	 */
	async saveBlockSettings(settings: Object, key?: string = '') {
		await localforage.setItem(`${this.blockName}_${this.name}_${key}`, settings);
		return settings;
	}

	/**
	 * Loads block settings from the local storage
	 * @param [key] - block key
	 */
	async loadBlockSettings(key?: string = '') {
		return await localforage.getItem(`${this.blockName}_${this.name}_${key}`);
	}
}
