'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import Async from '../../core/async';
import iBase from '../i-base/i-base';
import VueInterface from './modules/vue';
import { model } from '../../core/block';
import { abstract, field, blockProp, wait, blockProps, binds, watchers, locals, mixins } from './modules/decorators';
import './modules/directives';

const
	$C = require('collection.js'),
	Vue = require('vue');

const
	EventEmitter2 = require('eventemitter2'),
	localforage = require('localforage'),
	uuid = require('uuid');

export {

	abstract,
	field,
	params,
	blockProp,
	bindToParam,
	mixin,
	watch,
	mod,
	removeMod,
	elMod,
	removeElMod,
	state,
	wait

} from './modules/decorators';

const
	mods = {};

export const
	PARENT = {},
	initedBlocks = new WeakMap(),
	global = new EventEmitter2({maxListeners: 1e3, wildcard: true});

@model()
export default class iBlock extends VueInterface {
	/**
	 * @param name - component name
	 * @param props - component properties
	 * @param fields - component fields
	 * @param parent - parent component name
	 */
	constructor(name: string, props: Object, fields: Object, parent?: string) {
		super();
		const component = {
			name,
			props,
			watch: {},
			methods: {},
			mixins: [],
			computed: {
				instance: () => this
			},
			data() {
				return $C(fields).reduce((map, {initializer: val}, key) => {
					map[key] = Object.isFunction(val) ? val(this) : val;
					return map;

				}, {});
			}
		};

		const whitelist = {
			beforeCreate: true,
			created: true,
			destroyed: true,
			beforeMount: true,
			mounted: true,
			beforeUpdate: true,
			updated: true,
			activated: true,
			deactivated: true,
			render: true,
			template: true,
			data: true,
			directives: true,
			components: true,
			transitions: true,
			filters: true,
			functional: true,
			delimiters: true,
			parent: true,
			extends: true,
			propsData: true
		};

		const blacklist = {
			constructor: true,
			$on: true,
			$once: true,
			$off: true,
			$emit: true,
			$watch: true,
			$refs: true,
			$options: true,
			$root: true
		};

		const obj = Object.getPrototypeOf(this);
		$C(Object.getOwnPropertyNames(obj)).forEach((prop) => {
			if (blacklist[prop]) {
				return;
			}

			if (whitelist[prop]) {
				component[prop] = this[prop];
				return;
			}

			const
				{get, set} = Object.getOwnPropertyDescriptor(obj, prop);

			if (get || set) {
				const
					obj = get || set;

				if (obj.abstract) {
					return;
				}

				component.computed[prop] = {
					cached: Boolean(obj.cached),
					get,
					set
				};

				return;
			}

			const
				val = this[prop];

			if (val && val.abstract) {
				return;
			}

			if (prop.slice(0, 2) === '$$') {
				component.watch[prop.slice(2)] = {
					immediate: Boolean(val.immediate),
					handler: val
				};

				return;
			}

			component.methods[prop] = val;
		});

		mixins[name] = mixins[name] || {};
		mods[name] = {};

		$C(this.constructor).forEach((el, prop) => {
			if (prop[0] === '_') {
				return;
			}

			if (prop === 'mods') {
				const
					parentMods = mods[parent];

				if (parentMods) {
					el = Object.mixin(false, {}, parentMods, el);
					$C(el).forEach((mod, key) => {
						$C(mod).forEach((el, i, data, o) => {
							if (el !== PARENT || !parentMods[key]) {
								return;
							}

							const
								parent = parentMods[key].slice(),
								hasDefault = $C(el).some((el) => Object.isArray(el));

							if (hasDefault) {
								$C(parent).forEach((el, i, data, o) => {
									if (Object.isArray(el)) {
										parent[i] = el[0];
										return o.break;
									}
								});
							}

							mod.splice(i, 1, ...parent);
							return o.break;
						});
					});
				}

				mods[name] = el;
				component[prop] = $C(el).reduce((map, el, key) => {
					const def = $C(el).get({filter: Object.isArray, mult: false});
					map[key] = def ? def[0] : undefined;
					return map;
				}, {});

				return;
			}

			let
				mixin = mixins[name][prop];

			if (mixin && parent && !Object.isFunction(mixin)) {
				const
					parentProp = mixins[parent][prop];

				if (parentProp) {
					if (Object.isArray(parentProp) && Object.isArray(mixin)) {
						mixin = parentProp.union(mixin);

					} else {
						mixin = Object.mixin({deep: true, concatArray: true}, {}, mixins[parent][prop], mixin);
					}
				}
			}

			mixins[name][prop] = component[prop] = mixin || el;

		}, {notOwn: true});

		return component;
	}

	/**
	 * Block unique id
	 */
	@field(() => `b-${uuid.v4()}`)
	blockId: string;

	/**
	 * Block unique name
	 */
	blockName: ?string;

	/**
	 * Initial block modifiers
	 */
	@blockProp('mods', 'mods')
	initMods: Object = {};

	/**
	 * Initial block stage
	 */
	initStage: ?string;

	/**
	 * Dispatching mode
	 */
	dispatching: boolean = false;

	/**
	 * Store of the block modifiers
	 */
	@field((o) => o.initMods)
	modsStore: Object;

	/**
	 * The block stage
	 */
	@field((o) => o.initStage)
	stage: ?string;

	/**
	 * Link to the component constructor
	 */
	@abstract
	instance: iBlock;

	/**
	 * Async object
	 */
	@abstract
	async: Async;

	/**
	 * Local Event object
	 */
	@abstract
	local: EventEmitter2;

	/**
	 * Global Event object
	 */
	@abstract
	global: EventEmitter2;

	/**
	 * Link to the block object
	 * @see iBase
	 */
	@field(null)
	block: iBase;

	/**
	 * Modifiers synchronization
	 */
	@wait('loading')
	$$modsStore(value: Object) {
		$C(value).forEach((el, key) => {
			el = String(el);
			if (el !== this.block.getMod(key)) {
				this.setMod(key, el);
			}
		});
	}

	/**
	 * Change stage event
	 */
	$$stage(value: string, oldValue: string) {
		this.emit('changeStage', value, oldValue);
	}

	/**
	 * Block modifiers
	 */
	static mods = {
		theme: [
			['default']
		],

		size: [
			'xxs',
			'xs',
			's',
			['m'],
			'xs',
			'xxs'
		],

		progress: [
			'true',
			['false']
		],

		disabled: [
			'true',
			['false']
		],

		focused: [
			'true',
			['false']
		],

		hidden: [
			'true',
			['false']
		],

		debugSelected: [
			'true',
			['false']
		],

		invertedBorder: [
			'true',
			['false']
		]
	};

	/**
	 * Size converter
	 */
	static sizeTo = {
		gt: {
			xxl: 'xxl',
			xl: 'xxl',
			l: 'xl',
			m: 'l',
			undefined: 'l',
			s: 'm',
			xs: 's',
			xxs: 'xs'
		},

		lt: {
			xxl: 'xl',
			xl: 'l',
			l: 'm',
			m: 's',
			undefined: 's',
			s: 'xs',
			xs: 'xxs',
			xxs: 'xxs'
		}
	};

	/**
	 * Link for the $options.name
	 */
	get componentName() {
		return this.$options.name;
	}

	/**
	 * Link for the $options.parentComponent
	 */
	get parentComponent(): Object {
		return this.$options.parentComponent;
	}

	/**
	 * Link for the Object.mixin
	 */
	get mixin(): Function {
		return Object.mixin;
	}

	/**
	 * Group name for the current stage
	 */
	get stageGroup(): string {
		return `stage.${this.stage}`;
	}

	/**
	 * Block modifiers
	 */
	get mods(): Object {
		return $C(this.modsStore).map(String);
	}

	/**
	 * Sets an object of modifiers
	 * @param value
	 */
	set mods(value: Object) {
		this.modsStore = value;
	}

	/**
	 * Base block modifiers
	 */
	get baseMods(): Object<string> {
		return {theme: this.mods.theme, size: this.mods.size};
	}

	/**
	 * Alias for $options.sizeTo.gt
	 */
	get gt(): Object {
		return this.$options.sizeTo.gt;
	}

	/**
	 * Alias for $options.sizeTo.lt
	 */
	get lt(): Object {
		return this.$options.sizeTo.lt;
	}

	/**
	 * Link for the wait function
	 */
	get waitState(): Function {
		return wait;
	}

	/**
	 * Block status
	 */
	get blockStatus(): string {
		return this.block.status;
	}

	/**
	 * Sets a block status
	 * @param value
	 */
	set blockStatus(value: string) {
		this.block.state = value;
	}

	/**
	 * Loads block data
	 */
	async initLoad() {
		this.blockStatus = this.blockStatus.ready;
	}

	/**
	 * Wrapper for Object.assign
	 */
	assign(obj: ?Object, ...objs: ?Object): Object {
		return Object.assign(obj || {}, ...objs);
	}

	/**
	 * Sets Vue property
	 *
	 * @param name
	 * @param value
	 */
	setField(name: string, value: any): any {
		/* eslint-disable consistent-this */

		let obj = this;
		$C(name.split('.')).forEach((prop, i, data) => {
			if (data.length === i + 1) {
				name = prop;
				return;
			}

			if (!obj[prop] || typeof obj[prop] !== 'object') {
				Vue.set(obj, prop, isNaN(Number(data[i + 1])) ? {} : []);
			}

			obj = obj[prop];
		});

		Vue.set(obj, name, value);
		return value;

		/* eslint-enable consistent-this */
	}

	/**
	 * Returns the specified Vue property
	 * @param name
	 */
	getField(name: string): any {
		const
			path = name.split('.'),
			obj = $C(this);

		if (obj.in(path)) {
			return obj.get(path);
		}
	}

	/**
	 * Wrapper for $emit
	 *
	 * @param event
	 * @param args
	 */
	emit(event: string, ...args: any) {
		event = event.dasherize();
		this.$emit(event, this, ...args);
		this.dispatching && this.dispatch(event, ...args);
	}

	/**
	 * Emits the specified event for the parent block
	 *
	 * @param event
	 * @param args
	 */
	dispatch(event: string, ...args: any) {
		event = event.dasherize();

		let
			obj = this.$parent;

		while (obj) {
			obj.$emit(`${this.componentName}.${event}`, this, ...args);

			if (this.blockName) {
				obj.$emit(`${this.blockName.dasherize()}.${event}`, this, ...args);
			}

			if (!obj.dispatching) {
				break;
			}

			obj = obj.$parent;
		}
	}

	/**
	 * Wrapper for $on
	 *
	 * @param event
	 * @param cb
	 */
	on(event: string, cb: Function) {
		this.$on(event.dasherize(), cb);
	}

	/**
	 * Wrapper for $once
	 *
	 * @param event
	 * @param cb
	 */
	once(event: string, cb: Function) {
		this.$once(event.dasherize(), cb);
	}

	/**
	 * Wrapper for $off
	 *
	 * @param [event]
	 * @param [cb]
	 */
	off(event?: string, cb?: Function) {
		this.$off(event && event.dasherize(), cb);
	}

	/**
	 * Promise for $nextTick
	 *
	 * @param [label]
	 * @param [group]
	 */
	nextTick({label, group}?: {label?: string, group?: string} = {}) {
		this.async.promise(new Promise((resolve) => this.$nextTick(resolve)), {label, group});
	}

	/**
	 * Sets a block modifier
	 *
	 * @param name
	 * @param value
	 */
	@wait('loading')
	setMod(name: string, value: any): boolean {
		return this.block.setMod(name, value);
	}

	/**
	 * Removes a block modifier
	 *
	 * @param name
	 * @param [value]
	 */
	@wait('loading')
	removeMod(name: string, value?: any): boolean {
		return this.block.removeMod(name, value);
	}

	/**
	 * Disables the block
	 */
	@wait('loading')
	disable() {
		this.setMod('disabled', true);
		this.emit('disable');
	}

	/**
	 * Enables the block
	 */
	@wait('loading')
	enable() {
		this.setMod('disabled', false);
		this.emit('enable');
	}

	/**
	 * Sets focus to the block
	 */
	@wait('loading')
	focus() {
		this.setMod('focus', true);
	}

	/**
	 * Returns true if the block has all modifiers from specified
	 *
	 * @param mods - list of modifiers (['name', ['name', 'value']])
	 * @param [value] - value of modifiers
	 */
	ifEveryMods(mods: Array<Array | string>, value?: any): boolean {
		return $C(mods).every((el) => {
			if (Object.isArray(el)) {
				return this.mods[el[0]] === String(el[1]);
			}

			return this.mods[el] === String(value);
		});
	}

	/**
	 * Returns true if the block has at least one modifier from specified
	 *
	 * @param mods - list of modifiers (['name', ['name', 'value']])
	 * @param [value] - value of modifiers
	 */
	ifSomeMod(mods: Array<Array | string>, value?: any): boolean {
		return $C(mods).some((el) => {
			if (Object.isArray(el)) {
				return this.mods[el[0]] === String(el[1]);
			}

			return this.mods[el] === String(value);
		});
	}

	/**
	 * Returns an instance of Vue component by the specified selector / element
	 *
	 * @param query
	 * @param [filter]
	 */
	$(query: string | Element, filter?: string = ''): ?Vue {
		const $0 = Object.isString(query) ? document.query(query) : query;
		return initedBlocks.get($0.closest(`.i-block-helper${filter}`));
	}

	/**
	 * Binds a modifier to the specified parameter
	 *
	 * @param mod
	 * @param param
	 * @param [fn] - converter function
	 * @param [opts] - additional options
	 */
	bindModToParam(mod: string, param: string, fn?: Function = Boolean, opts?: Object) {
		opts = Object.assign({immediate: true}, opts);
		this.$watch(param, (val) => this.setMod(mod, fn(val)), opts);
	}

	/* eslint-disable no-unused-vars */

	/**
	 * Returns a full name of the specified element
	 *
	 * @param elName
	 * @param [modName]
	 * @param [modValue]
	 */
	getFullElName(elName: string, modName?: string, modValue?: any): string {
		return iBase.prototype.getFullElName.call({blockName: this.componentName}, ...arguments);
	}

	/**
	 * Returns an array of element classes by the specified parameters
	 * @param mods
	 */
	getElClasses(mods: Object): Array<string> {
		return $C(mods).reduce((arr, mods, el) => {
			arr.push(this.getFullElName(el));

			$C(mods).forEach((val, key) => {
				if (val !== undefined) {
					arr.push(this.getFullElName(el, key, val));
				}
			});

			return arr;

		}, []).concat(this.blockId);
	}

	/**
	 * Puts the block root element to the stream
	 * @param cb
	 */
	async putInStream(cb: (el: Element) => void) {
		await this.async.sleep(0.01.second());

		const
			el = this.$el;

		if (el.offsetHeight) {
			cb.call(this, el);
			return;
		}

		const wrapper = document.createElement('div');
		Object.assign(wrapper.style, {
			'display': 'block',
			'position': 'absolute',
			'top': 0,
			'left': 0,
			'z-index': -1
		});

		const
			parent = el.parentNode,
			before = el.nextSibling;

		wrapper.appendChild(el);
		document.body.appendChild(wrapper);
		cb.call(this, el);

		if (parent) {
			if (before) {
				parent.insertBefore(el, before);

			} else {
				parent.appendChild(el);
			}
		}

		wrapper.remove();
	}

	/**
	 * Saves the specified block settings to the local storage
	 *
	 * @param settings
	 * @param [key] - block key
	 */
	async saveSettings(settings: Object, key?: string = ''): Object {
		await localforage.setItem(`${this.componentName}_${this.blockName}_${key}`, settings);
		return settings;
	}

	/**
	 * Loads block settings from the local storage
	 * @param [key] - block key
	 */
	async loadSettings(key?: string = ''): ?Object {
		return await localforage.getItem(`${this.componentName}_${this.blockName}_${key}`);
	}

	/**
	 * Block inited
	 */
	beforeCreate() {
		this.async = new Async(this);
		this.local = new EventEmitter2({maxListeners: 100, wildcard: true});
		this.global = global;
	}

	/**
	 * Block created
	 */
	created() {
		$C(this.$options.mods).forEach((val, mod) => {
			const
				key = `mods.${mod}`;

			if (mod in this.initMods) {
				this.setField(key, this.initMods[mod]);
				return;
			}

			if (val !== undefined) {
				this.setField(key, String(val));
			}
		});
	}

	/**
	 * Block mounted
	 */
	mounted() {
		initedBlocks.set(this.$el, this);

		const
			localBlockProps = {};

		let obj = this.$options;
		while (obj) {
			$C(watchers[obj.name]).forEach((fn) => fn.call(this));
			$C(binds[obj.name]).forEach((fn) => fn.call(this));
			$C(locals[obj.name]).forEach((fn) => fn.call(this));
			$C(blockProps[obj.name]).reduce((map, [name, key]) => (map[name] = this[key], map), localBlockProps);
			obj = obj.parentComponent;
		}

		this.local.on('block.mod.set.**', ({name, value}) => this.setField(`mods.${name}`, value));
		this.local.on('block.mod.remove.**', ({name}) => this.setField(`mods.${name}`, undefined));
		this.local.on('block.mod.*.disabled.*', ({type, value}) => {
			if (value === 'false' || type === 'remove') {
				this.async.removeNodeEventListener({group: 'blockOnDisable'});

			} else {
				this.async.addNodeEventListener(this.$el, 'click mousedown touchstart keydown input change scroll', {
					group: 'blockOnDisable',
					fn(e) {
						e.preventDefault();
						e.stopImmediatePropagation();
					}

				}, true);
			}
		});

		/**
		 * BEM object
		 */
		this.block = new iBase(Object.assign(localBlockProps, {
			global,
			local: this.local,
			async: this.async,
			model: this,
			node: this.$el,
			id: this.blockId
		}));

		this.initLoad();
	}

	/**
	 * Block destroyed
	 */
	destroyed() {
		this.block.destructor();
	}
}
