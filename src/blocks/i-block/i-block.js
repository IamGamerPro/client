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
import { binds, handlers, events, props, mixin, wait } from './modules/decorators';

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
	 * Block public interface
	 */
	props: {
		@blockProp('id')
		blockId: {
			type: String,
			default: () => `b-${uuid.v4()}`
		},

		blockName: {
			type: String
		},

		@blockProp()
		mods: {
			type: Object,
			coerce: (val) => $C(val || {}).map(String)
		},

		dispatching: {
			type: Boolean,
			default: false
		},

		broadcasting: {
			type: Boolean,
			default: false
		},

		stage: {
			type: String
		}
	},

	watch: {
		@wait('ready')
		mods(val) {
			$C(val).forEach((el, key) => {
				if (el !== this.block.getMod(key)) {
					this.setMod(key, el);
				}
			});
		},

		stage(val, oldVal) {
			this.emit('changeStage', val, oldVal);
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

		invertedBorder: [
			'true',
			['false']
		]
	},

	@mixin
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

	/**
	 * Block computed properties
	 */
	computed: {
		/**
		 * Base block modifiers
		 */
		baseMods(): Object {
			return {theme: this.mods.theme, size: this.mods.size};
		},

		/**
		 * Alias for $options.sizeTo.gt
		 */
		gt(): Object {
			return this.$options.sizeTo.gt;
		},

		/**
		 * Alias for $options.sizeTo.lt
		 */
		lt(): Object {
			return this.$options.sizeTo.lt;
		},

		/**
		 * Link for Object
		 */
		Object() {
			return Object;
		},

		/**
		 * Link for Array
		 */
		Array() {
			return Array;
		},

		/**
		 * Link for Number
		 */
		Number() {
			return Number;
		},

		/**
		 * Link for String
		 */
		String() {
			return String;
		},

		/**
		 * Link for Boolean
		 */
		Boolean() {
			return Boolean;
		},

		/**
		 * Link for Date
		 */
		Date() {
			return Date;
		},

		/**
		 * Link for Math
		 */
		Math() {
			return Math;
		},

		/**
		 * Link for JSON
		 */
		JSON() {
			return JSON;
		},

		/**
		 * Link for console
		 */
		console() {
			return console;
		},

		/**
		 * Link for Object.mixin
		 */
		mixin() {
			return Object.mixin;
		},

		/**
		 * Link for wait
		 */
		waitState() {
			return wait;
		},

		/**
		 * Link for block.status
		 */
		blockStatus: {
			set(value) {
				this.block.state = value;
			},

			get() {
				return this.block.status;
			}
		}
	},

	/**
	 * Block methods
	 */
	methods: {
		/**
		 * Loads block data
		 */
		async initLoad() {
			this.blockStatus = this.blockStatus.ready;
		},

		/**
		 * Wrapper for Object.assign
		 */
		assign(obj: ?Object, ...objs: ?Object): Object {
			return Object.assign(obj || {}, ...objs);
		},

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
			this.broadcasting && this.broadcast(event, ...args);
		},

		/**
		 * Wrapper for $dispatch
		 *
		 * @param event
		 * @param args
		 */
		dispatch(event: string, ...args: any) {
			event = event.dasherize();
			this.$dispatch(`${this.$options.name}.${event}`, this, ...args);

			if (this.blockName) {
				this.$dispatch(`${this.blockName.dasherize()}.${event}`, this, ...args);
			}
		},

		/**
		 * Wrapper for $broadcast
		 *
		 * @param event
		 * @param args
		 */
		broadcast(event: string, ...args: any) {
			event = event.dasherize();
			this.$broadcast(`${this.$options.name}.${event}`, this, ...args);

			if (this.blockName) {
				this.$broadcast(`${this.blockName.dasherize()}.${event}`, this, ...args);
			}
		},

		/**
		 * Sets a block modifier
		 *
		 * @param name
		 * @param value
		 */
		@wait('ready')
		setMod(name: string, value: any): boolean {
			return this.block.setMod(name, value);
		},

		/**
		 * Removes a block modifier
		 *
		 * @param name
		 * @param [value]
		 */
		@wait('ready')
		removeMod(name: string, value?: any): boolean {
			return this.block.removeMod(name, value);
		},

		/**
		 * Disables the current block
		 */
		@wait('ready')
		disable() {
			this.setMod('disabled', true);
			this.emit('disable');
		},

		/**
		 * Enables the current block
		 */
		@wait('ready')
		enable() {
			this.setMod('disabled', false);
			this.emit('enable');
		},

		/**
		 * Sets focus to the current block
		 */
		@wait('ready')
		focus() {
			this.setMod('focus', true);
		},

		/**
		 * Returns true if the current block has all modifiers from specified
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
		 * Returns true if the current block has at least one modifier from specified
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
		 *
		 * @param query
		 * @param [filter]
		 */
		$(query: string | Element, filter?: string = ''): ?Vue {
			const $0 = Object.isString(query) ? document.query(query) : query;
			return initedBlocks.get($0.closest(`.i-block-helper${filter}`));
		},

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
		},

		/**
		 * Returns a full name of the specified element
		 *
		 * @param elName
		 * @param [modName]
		 * @param [modValue]
		 */
		getFullElName(elName: string, modName?: string, modValue?: any): string {
			return this.$options.block.prototype.getFullElName.call({blockName: this.$options.name}, ...arguments);
		},

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
		},

		/**
		 * Adds Drag&Drop listeners to the specified element
		 *
		 * @param el
		 * @param [group]
		 * @param [label]
		 * @param [onClear]
		 * @param [onDragStart]
		 * @param [onDrag]
		 * @param [onDragEnd]
		 * @param [useCapture]
		 */
		dnd(
			el: Element,

			{
				group = `dnd.${uuid.v4()}`,
				label,
				onClear,
				onDragStart,
				onDrag,
				onDragEnd

			}: {
				group?: string,
				label?: string,
				onClear?: (link: Object, event: string) => void,
				onDragStart?: (e: Event, el: Node) => void | {capture?: boolean, handler?: (e: Event, el: Node) => void},
				onDrag?: (e: Event, el: Node) => void | {capture?: boolean, handler?: (e: Event, el: Node) => void},
				onDragEnd?: (e: Event, el: Node) => void | {capture?: boolean, handler?: (e: Event, el: Node) => void}
			},

			useCapture?: boolean

		): string {
			const
				{async: $a} = this,
				p = {group, label};

			function dragStartClear() {
				onClear && onClear.call(this, ...arguments, 'dragstart');
			}

			function dragClear() {
				onClear && onClear.call(this, ...arguments, 'drag');
			}

			function dragEndClear() {
				onClear && onClear.call(this, ...arguments, 'dragend');
			}

			const
				dragStartUseCapture = Boolean(onDragStart && Object.isBoolean(onDragStart.capture) ?
					onDragStart.capture : useCapture),

				dragUseCapture = Boolean(onDrag && Object.isBoolean(onDrag.capture) ? onDrag.capture : useCapture),
				dragEndUseCapture = Boolean(onDragEnd && Object.isBoolean(onDragEnd.capture) ? onDragEnd.capture : useCapture);

			const dragStart = (e) => {
				e.preventDefault();
				let res;

				if (onDragStart) {
					res = (onDragStart.handler || onDragStart).call(this, e, el);
				}

				const drag = (e) => {
					e.preventDefault();

					if (res !== false && onDrag) {
						res = (onDrag.handler || onDrag).call(this, e, el);
					}
				};

				const
					links = [];

				$C(['mousemove', 'touchmove']).forEach((e) => {
					links.push(
						$a.addNodeEventListener(
							document,
							e,
							Object.assign({fn: drag, onClear: dragClear}, p),
							dragUseCapture
						)
					);
				});

				const dragEnd = (e) => {
					e.preventDefault();

					if (res !== false && onDragEnd) {
						res = (onDragEnd.handler || onDragEnd).call(this, e, el);
					}

					$C(links).forEach((id) => $a.removeNodeEventListener({id, group}));
				};

				$C(['mouseup', 'touchend']).forEach((e) => {
					links.push(
						$a.addNodeEventListener(
							document,
							e,
							Object.assign({fn: dragEnd, onClear: dragEndClear}, p),
							dragEndUseCapture
						)
					);
				});
			};

			$C(['mousedown', 'touchstart']).forEach((e) => {
				$a.addNodeEventListener(
					el,
					e,
					Object.assign({fn: dragStart, onClear: dragStartClear}, p),
					dragStartUseCapture
				);
			});

			return group;
		},

		/**
		 * Puts the block root element to the stream
		 * @param cb
		 */
		putInStream(cb: (el: Element) => void) {
			this.async.setTimeout(() => {
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

			}, 0.01.second());
		},

		/**
		 * Saves the specified block settings to the local storage
		 *
		 * @param settings
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
			$C(handlers[obj.name]).forEach((fn) => fn.call(this));
			$C(binds[obj.name]).forEach((fn) => fn.call(this));
			$C(events[obj.name]).forEach((fn) => fn.call(this));
			obj = obj.parentBlock;
		}

		this.event.on('block.mod.set.**', ({name, value}) => this.$set(`mods.${name}`, value));
		this.event.on('block.mod.remove.**', ({name}) => this.$set(`mods.${name}`, undefined));
		this.event.on('block.mod.*.disabled.*', ({type, value}) => {
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
		})
	}
})

@block
export default class iBlock extends iBase {}
