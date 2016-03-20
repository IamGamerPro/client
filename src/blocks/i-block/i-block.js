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
import { block, model, blockProp, lastBlock, initedBlocks, status } from '../../core/block';

const
	binds = {},
	handlers = {},
	events = {},
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

/**
 * Decorates a method as a modifier handler
 *
 * @decorator
 * @param name - modifier name
 * @param [value] - modifier value
 * @param [method] - event method
 */
export function mod(name: string, value?: any = '*', method?: string = 'on') {
	if (!lastBlock) {
		throw new Error('Invalid usage of @mod decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`block.mod.set.${name}.${value}`, descriptor.value);
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
	if (!lastBlock) {
		throw new Error('Invalid usage of @removeMod decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`block.mod.remove.${name}.${value}`, descriptor.value);
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
	if (!lastBlock) {
		throw new Error('Invalid usage of @elMod decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`el.mod.set.${el}.${name}.${value}`, descriptor.value);
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
	if (!lastBlock) {
		throw new Error('Invalid usage of @removeElMod decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`el.mod.remove.${el}.${name}.${value}`, descriptor.value);
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
	if (!lastBlock) {
		throw new Error('Invalid usage of @state decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`block.state.${state}`, descriptor.value);
		});
	};
}

/**
 * Decorates a method for using with the specified state
 *
 * @decorator
 * @param state - block init state
 */
export function wait(state: number) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @wait decorator. Need to use @block.');
	}

	return function (target, key, descriptor) {
		const fn = descriptor.value;
		descriptor.value = function () {
			if (this.block.state === state) {
				return;
			}

			if (this.block.state > state) {
				fn.call(this, ...arguments);

			} else {
				this.event.once(`block.state.${status[state]}`, () => fn.call(this, ...arguments));
			}
		};
	};
}

@model({
	/**
	 * Block tag type
	 */
	tag: 'div',

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
			coerce: (val) => $C(val || {}).map(String)
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
		 * Returns an instance of Vue component by the specified selector / element
		 * @param query
		 */
		$(query: string | Element): ?Vue {
			const $0 = Object.isString(query) ? document.query(query) : query;
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

				const
					links = [];

				links.push(this.async.addNodeEventListener(document, 'mousemove', {fn: drag, group}));
				links.push(this.async.addNodeEventListener(document, 'touchmove', {fn: drag, group}));

				const dragEnd = (e) => {
					onDragEnd && onDragEnd.call(this, e, el);
					$C(links).forEach((id) => this.async.removeNodeEventListener({id, group}));
				};

				links.push(this.async.addNodeEventListener(document, 'mouseup', {fn: dragEnd, group}));
				links.push(this.async.addNodeEventListener(document, 'touchend', {fn: dragEnd, group}));
			};

			this.async.addNodeEventListener(el, 'mousedown', {fn: dragStart, group});
			this.async.addNodeEventListener(el, 'touchstart', {fn: dragStart, group});

			return group;
		},

		/**
		 * Puts the component root element to the stream
		 * @param cb - callback function
		 */
		putInStream(cb: (el: Element) => void) {
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
			cb.call(this);

			if (parent) {
				if (before) {
					parent.insertBefore(el, before);

				} else {
					parent.appendChild(el);
				}
			}

			wrapper.remove();
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

	compiled() {
		let obj = this.$options;
		while (obj) {
			$C(events[obj.name]).forEach((fn) => fn.call(this));
			obj = obj.parentBlock;
		}
	},

	ready() {
		let obj = this.$options;
		while (obj) {
			$C(binds[obj.name]).forEach((fn) => fn.call(this));
			$C(handlers[obj.name]).forEach((fn) => fn.call(this));
			obj = obj.parentBlock;
		}

		this.event.on('block.mod.set.**', ({name, value}) => this.$set(`mods.${name}`, value));
		this.event.on('block.mod.remove.**', ({name}) => this.$set(`mods.${name}`, undefined));
	}
})

@block
export default class iBlock extends iBase {}
