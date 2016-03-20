'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import uuid from 'uuid';
import $C from 'collection.js';
import localforage from 'localforage';
import iBase from '../i-base/i-base';
import { block, model, blockProp, initedBlocks } from '../../core/block';
import { binds, handlers, events, props, mixin } from './modules/decorators';

export {

	bindToParam,
	mixin,
	$watch,
	mod,
	removeMod,
	elMod,
	removeElMod,
	state,
	wait

} from './modules/decorators';

const
	mods = {},
	initedProps = {};

export const
	PARENT_MODS = {};

@model({
	/**
	 * Block tag type
	 */
	@mixin
	tag: 'div',

	/**
	 * Block loading type
	 */
	@mixin
	defer: false,

	/**
	 * Block public interface
	 */
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

	/**
	 * Block modifiers
	 */
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

	/**
	 * Block methods
	 */
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
		},

		/**
		 * Saves the specified block settings to the local storage
		 *
		 * @param settings - block settings
		 * @param [key] - block key
		 */
		async saveSettings(settings: Object, key?: string = '') {
			await localforage.setItem(`${this.$options.name}_${this.blockName}_${key}`, settings);
			return settings;
		},

		/**
		 * Loads block settings from the local storage
		 * @param [key] - block key
		 */
		async loadSettings(key?: string = '') {
			return await localforage.getItem(`${this.$options.name}_${this.blockName}_${key}`);
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
