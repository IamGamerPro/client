'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import uuid from 'uuid';
import EventEmitter2 from 'eventemitter2';
import $C from 'collection.js';
import Async from '../../core/async';
import { status } from '../../core/block';

const
	nameCache = {};

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
	 * Block model
	 */
	model: ?Vue;

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
	 * @param [event] - instance of EventEmitter2
	 * @param [model] - model instance
	 */
	constructor(
		{id, name, node, tpls, mods, async, event, model}: {
			id?: string,
			name?: string,
			node?: Element,
			tpls?: Object,
			mods?: Object,
			async?: Async,
			event?: EventEmitter2,
			model?: Vue
		} = {}

	) {
		if (name) {
			if (nameCache[name]) {
				throw new Error(`Block with name "${name}" already registered! Try another name.`);
			}

			nameCache[name] = true;
			this.name = name;
		}

		this.id = id || `b-${uuid.v4()}`;
		this.async = async || new Async();
		this.event = event || new EventEmitter2({wildcard: true});
		this.mods = {};
		this.elMods = new WeakMap();
		this.tpls = tpls;
		this.node = node;
		this.model = model;

		if (node) {
			node.classList.add(this.blockName, 'i-block-helper');
		}

		this.event.once(`block.state.${status[status.loading]}`, () => {
			$C(mods).forEach((val, name) => this.setMod(name, val));
		});

		if (node) {
			$C(node.queryAll(`.${this.id}`)).forEach((node) => {
				$C(node.classList).forEach((el) => {
					el = el.split('__');

					if (el.length === 2) {
						const
							mod = el[1].split('_');

						if (mod.length === 3) {
							this.setElMod(node, ...mod);
						}
					}
				});
			});
		}

		this.state = status.loading;
	}

	destructor() {
		this.async.clearAll();
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

			const event = {
				event: 'block.mod.set',
				name,
				value
			};

			this.event.emit(`block.mod.set.${name}.${value}`, event);
			this.model && this.model.$emit(`${this.blockName}-mod-set-${name.underscore()}-${value.underscore()}`, event);
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

			const event = {
				event: 'block.mod.remove',
				name,
				value: current
			};

			this.event.emit(`block.mod.remove.${name}.${current}`, event);
			this.model && this.model.$emit(`${this.blockName}-mod-remove-${name.underscore()}-${current.underscore()}`, event);
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
}
