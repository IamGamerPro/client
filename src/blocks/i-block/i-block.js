'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import Vue from 'vue';
import uuid from 'uuid';
import $C from 'collection.js';

import iBase from '../i-base/i-base';
import { block, model, blockProp, lastBlock, initedBlocks } from '../../core/block';

const
	binds = {},
	handlers = {},
	mods = {};

export const
	PARENT_MODS = {};

/**
 * Binds a modifier to the specified parameter
 *
 * @decorator
 * @param param - parameter name
 * @param [fn] - converter function
 * @param [opts] - additional options
 */
export function bindToParam(param: string, fn?: Function = Boolean, opts?: Object) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @bindToParam decorator. Need to use @block.');
	}

	return (target, key) => {
		binds[lastBlock] = (binds[lastBlock] || []).concat(function () {
			this.bindModToParam(key, param, fn, opts);
		});
	};
}

const
	props = {},
	initedProps = {};

/**
 * Sets @option as mixin
 * @decorator
 */
export function mixin(target, key) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @mixin decorator. Need to use @block.');
	}

	props[lastBlock] = (props[lastBlock] || []).concat(key);
}

/**
 * Adds watcher for the specified property
 *
 * @decorator
 * @param handler - handler function or the handler method name
 * @param [params] - additional parameters for $watch
 */
export function $watch(handler: (val: any, oldVal: any) => void | string, params?: Object) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @watch decorator. Need to use @block.');
	}

	return (target, key) => {
		handlers[lastBlock] = (handlers[lastBlock] || []).concat(function () {
			this.$watch(key, Object.isFunction(handler) ? handler : this[handler], params);
		});
	};
}

@model({
	props: {
		@blockProp('id')
		blockId: {
			type: String,
			default: () => `b-${uuid.v4()}`
		},

		@blockProp('name')
		blockName: {
			type: String
		},

		@blockProp()
		mods: {
			type: Object,
			coerce: (val) => $C(val).map(String),
			default: () => ({})
		}
	},

	methods: {
		/**
		 * Sets focus to the block
		 */
		focus() {
			this.block.setMod('focus', true);
		},

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
		},

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
		},

		/**
		 * Returns an instance of Vue component by the specified selector
		 * @param selector
		 */
		$(selector: string | Element): ?Vue {
			const $0 = document.query(selector);
			return initedBlocks.get($0.classList.contains('i-block-helper') ? $0 : $0.closest('.i-block-helper'));
		},

		/**
		 * Binds a modifier to the specified parameter
		 *
		 * @param mod - modifier name
		 * @param param - parameter name
		 * @param [fn] - converter function
		 * @param [opts] - additional options
		 */
		bindModToParam(mod: string, param: string, fn?: Function = Boolean, opts?: Object) {
			opts = Object.assign({immediate: true}, opts);
			this.$watch(param, (val) => this.block.setMod(mod, fn(val)), opts);
		},

		/**
		 * Returns a full name of the specified element
		 *
		 * @param name - element name
		 * @param [modName] - modifier name
		 * @param [modVal] - modifier value
		 */
		getFullElName(name: string, modName?: string, modVal?: any): string {
			return this.$options.block.prototype.getFullElName.call({blockName: this.$options.name}, ...arguments);
		},

		/**
		 * Returns an array of element classes by the specified parameters
		 * @param map - map of element modifiers
		 */
		getElClasses(map: Object): Array<string> {
			return $C(map).reduce((arr, mods, el) => {
				arr.push(this.getFullElName(el));

				$C(mods).forEach((val, key) => {
					if (val) {
						arr.push(this.getFullElName(el, key, val));
					}
				});

				return arr;

			}, []).concat(this.blockId);
		},

		/**
		 * Adds Drag&Drop listeners to the specified element
		 *
		 * @param el
		 * @param onDragStart
		 * @param onDrag
		 * @param onDragEnd
		 */
		dnd(
			el: Element,

			{
				onDragStart,
				onDrag,
				onDragEnd

			}: {
				onDragStart?: (e: Event, el: Node) => void,
				onDrag?: (e: Event, el: Node) => void,
				onDragEnd?: (e: Event, el: Node) => void
			}

		): string {
			const
				group = `dnd.${uuid.v4()}`;

			const dragStart = (e) => {
				onDragStart && onDragStart.call(this, e, el);

				const drag = (e) => {
					onDrag && onDrag.call(this, e, el);
				};

				this.async.addNodeEventListener(document, 'mousemove', {fn: drag, group});
				this.async.addNodeEventListener(document, 'touchmove', {fn: drag, group});

				const dragEnd = (e) => {
					onDragEnd && onDragEnd.call(this, e, el);
					this.async.removeNodeEventListener({group});
				};

				this.async.addNodeEventListener(document, 'mouseup', {fn: dragEnd, group});
				this.async.addNodeEventListener(document, 'touchend', {fn: dragEnd, group});
			};

			this.async.addNodeEventListener(el, 'mousedown', {fn: dragStart, group});
			this.async.addNodeEventListener(el, 'touchstart', {fn: dragStart, group});

			return group;
		}
	},

	mods: {
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

		block: [
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

		inverseBorder: [
			'true',
			['false']
		]
	},

	sizeTo: {
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
	},

	created() {
		const
			opts = this.$options,
			parentMods = opts.parentBlock && opts.parentBlock.mods;

		let
			$mods = mods[opts.name];

		if (!$mods) {
			$mods = opts.mods;

			if (parentMods) {
				$C($mods = Object.mixin(false, {}, parentMods, $mods)).forEach((mod, key) => {
					$C(mod).forEach((el, i) => {
						if (el === PARENT_MODS) {
							if (parentMods[key]) {
								const
									parent = parentMods[key].slice(),
									hasDefault = $C(el).some((el) => Object.isArray(el));

								if (hasDefault) {
									$C(parent).forEach((el, i) => {
										if (Object.isArray(el)) {
											parent[i] = el[0];
											return false;
										}
									});
								}

								mod.splice(i, 1, ...parent);
								return false;
							}
						}
					});
				});
			}

			$mods = mods[opts.name] = $C($mods).reduce((map, el, key) => {
				const def = $C(el).get({filter: Object.isArray, mult: false});
				map[key] = def ? def[0] : undefined;
				return map;
			}, {});
		}

		$C($mods).forEach((val, mod) => {
			if (mod in this.mods) {
				return;
			}

			if (val !== undefined) {
				this.$set(`mods.${mod}`, val);
			}
		});

		if (!initedProps[name]) {
			let obj = opts.parentBlock;

			const
				cache = initedProps[opts.name] = {};

			while (obj) {
				$C(props[obj.name]).forEach((el) => {
					cache[el] = Object.mixin({traits: true}, cache[el] || {}, obj[el]);
				});

				obj = obj.parentBlock;
			}

			$C(cache).forEach((el, key) => {
				cache[key] = Object.assign(el, opts[key]);
			});
		}

		$C(initedProps[opts.name]).forEach((el, key) => {
			opts[key] = el;
		});
	},

	ready() {
		let
			obj = this.$options;

		while (obj) {
			$C(binds[obj.name]).forEach((fn) => fn.call(this));
			$C(handlers[obj.name]).forEach((fn) => fn.call(this));
			obj = obj.parentBlock;
		}

		this.block.event.on('block.mod.set.**', ({name, value}) => this.$set(`mods.${name}`, value));
		this.block.event.on('block.mod.remove.**', ({name}) => this.$set(`mods.${name}`, undefined));
	}
})

@block
export default class iBlock extends iBase {

	/**
	 * Block model
	 */
	model: ?Vue;

	/**
	 * Block data
	 */
	data: ?Object;

	/**
	 * @override
	 * @param model - model instance
	 * @param [data] - model data object
	 */
	constructor({model, data}: {model: Vue} = {}) {
		super(...arguments);
		this.model = model;
	}
}
