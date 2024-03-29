'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import Async from '../../core/async';

const
	$C = require('collection.js'),
	EventEmitter2 = require('eventemitter2').EventEmitter2,
	uuid = require('uuid');

/**
 * Map of available block statuses
 */
export const status = Object.createMap({
	destroyed: -1,
	loading: 1,
	ready: 2,
	unloaded: 0
});

const
	staticGlobal = new EventEmitter2({wildcard: true});

export default class iBase {
	/**
	 * Block unique id
	 */
	id: ?string;

	/**
	 * Link to a block node
	 */
	node: ?Element;

	/**
	 * Block model
	 */
	model: ?iBlock;

	/**
	 * Async object
	 */
	async: ?Async;

	/**
	 * Local event emitter
	 */
	local: ?EventEmitter2;

	/**
	 * Global event emitter
	 */
	global: ?EventEmitter2;

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
	$state: number = status.unloaded;

	/**
	 * Sets new state to the current block
	 * @param state
	 */
	set state(state: number) {
		if (this.$state === state) {
			return;
		}

		this.$state = state = state in this.status ? state : 0;
		this.local.emit(`block.state.${this.status[state]}`, state);
		this.model && this.model.emit(`state-${this.status[state]}`, state);
	}

	/**
	 * Return init state of the current block
	 */
	get state(): number {
		return this.$state;
	}

	/**
	 * Returns the current block name
	 */
	get blockName(): string {
		return this.model ? this.model.componentName : this.constructor.name.dasherize();
	}

	/**
	 * @param [id] - block id
	 * @param [node] - link to a block node
	 * @param [tpls] - map of templates
	 * @param [mods] - map of modifiers to apply
	 * @param [async] - instance of Async
	 * @param [local] - instance of EventEmitter2
	 * @param [global] - global instance of EventEmitter2
	 * @param [model] - model instance
	 */
	constructor(
		{id, node, tpls, mods, async, local, global, model}: {
			id?: string,
			node?: Element,
			tpls?: Object,
			mods?: Object,
			async?: Async,
			local?: EventEmitter2,
			global?: EventEmitter2,
			model?: iBlock
		} = {}

	) {
		this.id = id || `b-${uuid.v4()}`;
		this.async = async || new Async(this);
		this.local = local || new EventEmitter2({wildcard: true});
		this.global = global || staticGlobal;

		this.mods = {};
		this.elMods = new WeakMap();

		this.node = node;
		this.tpls = tpls;

		if (model) {
			this.model = model;
			model.block = this;
		}

		if (node) {
			node.classList.add(this.blockName, 'i-block-helper');
		}

		this.local.once(`block.state.loading`, () => {
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
		this.state = status.destroyed;
		this.async.clearAll();
	}

	/**
	 * Returns the full name of the current block
	 *
	 * @param [modName]
	 * @param [modValue]
	 */
	getFullBlockName(modName?: string, modValue?: any): string {
		return this.blockName + (modName ? `_${modName.dasherize()}_${String(modValue).dasherize()}` : '');
	}

	/**
	 * Returns the full name of the specified element
	 *
	 * @param elName
	 * @param [modName]
	 * @param [modValue]
	 */
	getFullElName(elName: string, modName?: string, modValue?: any): string {
		const modStr = modName ? `_${modName.dasherize()}_${String(modValue).dasherize()}` : '';
		return `${this.blockName}__${elName.dasherize()}${modStr}`;
	}

	/**
	 * Returns CSS selector for the specified element
	 *
	 * @param elName
	 * @param [mods]
	 */
	getElSelector(elName: string, ...mods?: Array<Array>): string {
		const sel = `.${this.getFullElName(elName)}`;
		return $C(mods).reduce((res, [name, val]) => `${res}${sel}_${name}_${val}`, `${sel}.${this.id}`);
	}

	/**
	 * Returns block child elements by the specified request
	 *
	 * @param elName
	 * @param [mods]
	 */
	elements(elName: string, ...mods?: Array<Array>): Array<Element> {
		return this.node.queryAll(this.getElSelector(elName, ...mods));
	}

	/**
	 * Returns a child element by the specified request
	 *
	 * @param elName
	 * @param [mods]
	 */
	element(elName: string, ...mods?: Array<Array>): Array<Element> {
		return this.node.query(this.getElSelector(elName, ...mods));
	}

	/**
	 * Sets a block modifier
	 *
	 * @param name
	 * @param value
	 */
	setMod(name: string, value: any): boolean {
		value = String(value);

		if (this.mods[name] !== value) {
			this.removeMod(name);
			this.mods[name] = value;
			this.node.classList.add(this.getFullBlockName(name, value));

			const event = {
				event: 'block.mod.set',
				type: 'set',
				name,
				value
			};

			this.local.emit(`block.mod.set.${name}.${value}`, event);
			this.model && this.model.emit(`mod.set.${name}.${value}`, event);
			return true;
		}

		return false;
	}

	/**
	 * Removes a block modifier
	 *
	 * @param name
	 * @param [value]
	 */
	removeMod(name: string, value?: any): boolean {
		const
			current = this.mods[name];

		if (name in this.mods && (value === undefined || current === String(value))) {
			delete this.mods[name];
			this.node.classList.remove(this.getFullBlockName(name, current));

			const event = {
				event: 'block.mod.remove',
				type: 'remove',
				name,
				value: current
			};

			this.local.emit(`block.mod.remove.${name}.${current}`, event);
			this.model && this.model.emit(`mod.remove.${name}.${current}`, event);
			return true;
		}

		return false;
	}

	/**
	 * Returns a value of the specified block modifier
	 * @param mod
	 */
	getMod(mod: string): ?string {
		return this.mods[mod];
	}

	/**
	 * Sets a modifier to the specified element
	 *
	 * @param link - link to the element
	 * @param elName
	 * @param modName
	 * @param value
	 */
	setElMod(link: Element, elName: string, modName: string, value: any): boolean {
		value = String(value);

		const rootMods = this.elMods.get(link) || {};
		this.elMods.set(link, rootMods);

		const
			key = elName.dasherize(),
			mods = rootMods[key] = rootMods[key] || {};

		if (mods[modName] !== value) {
			this.removeElMod(link, elName, modName);
			mods[modName] = value;
			link.classList.add(this.getFullElName(elName, modName, value));
			this.local.emit(`el.mod.set.${elName}.${modName}.${value}`, {
				element: elName,
				event: 'el.mod.set',
				type: 'set',
				link,
				modName,
				value
			});

			return true;
		}

		return false;
	}

	/**
	 * Removes a modifier from the specified element
	 *
	 * @param link - link to the element
	 * @param elName
	 * @param modName
	 * @param [value]
	 */
	removeElMod(link: Element, elName: string, modName: string, value?: any): boolean {
		const rootMods = this.elMods.get(link) || {};
		this.elMods.set(link, rootMods);

		const
			key = elName.dasherize(),
			mods = rootMods[key] = rootMods[key] || {},
			current = mods[modName];

		if (modName in mods && (value === undefined || current === String(value))) {
			delete mods[modName];
			link.classList.remove(this.getFullElName(elName, modName, current));
			this.local.emit(`el.mod.remove.${elName}.${modName}.${current}`, {
				element: elName,
				event: 'el.mod.remove',
				type: 'remove',
				link,
				modName,
				value: current
			});

			return true;
		}

		return false;
	}

	/**
	 * Returns a value of a modifier from the specified element
	 *
	 * @param link - link to the element
	 * @param elName
	 * @param modName
	 */
	getElMod(link: Element, elName: string, modName: string): ?string {
		return ((this.elMods.get(link) || {})[elName.dasherize()] || {})[modName];
	}
}
