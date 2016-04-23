'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import Vue from 'vue';
import $C from 'collection.js';
import EventEmitter2 from 'eventemitter2';
import Async from './async';
import { json } from './parse';

/**
 * Map of available block statuses
 */
export const status = Object.createMap({
	destroyed: -1,
	loading: 1,
	ready: 2,
	unloaded: 0
});

/**
 * Cache for blocks
 */
export const
	blocks = {},
	components = {},
	staticComponents = {},
	blockProps = {},
	initedBlocks = new WeakMap();

const
	globalEvent = new EventEmitter2({wildcard: true});

function getBlockName(fn) {
	return fn.name.dasherize();
}

export let
	lastBlock,
	lastParentBlock;

/**
 * Adds a block to the global cache
 * @decorator
 */
export function block(target) {
	lastBlock = getBlockName(target);
	lastParentBlock = getBlockName(Object.getPrototypeOf(target));
	blocks[lastBlock] = target;
}

/**
 * Defines a property as block
 *
 * @decorator
 * @param [name] - property name
 */
export function blockProp(name?: string) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @blockProp decorator. Need to use @block.');
	}

	return (target, key) => {
		blockProps[lastBlock] = blockProps[lastBlock] || [];
		blockProps[lastBlock].push([name || key, key]);
	};
}

/**
 * Creates new Vue.js component
 *
 * @decorator
 * @param [component] - Vue component object
 * @param [tpls] - object with compiled templates
 * @param [data] - data for templates
 */
export function model(component?: Object, tpls?: Object, data?: any) {
	return (target) => {
		const
			name = getBlockName(target),
			parent = getBlockName(Object.getPrototypeOf(target));

		component = component || {};
		component.name = name;
		component.block = target;

		const
			parentBlock = components[parent],
			parentBlockStatic = staticComponents[parent];

		let
			{tag} = component;

		if (!tag) {
			let obj = parentBlockStatic;
			while (obj) {
				tag = obj.tag;

				if (tag) {
					break;
				}

				obj = obj.parentBlock;
			}

			tag = tag || 'div';
		}

		if (parentBlock) {
			component.mixins = component.mixins || [];
			component.mixins.push(parentBlock);
			component.parentBlock = parentBlockStatic;
		}

		if (tpls) {
			const cache = {};
			component.template = tpls[name].index.call(cache, Object.assign({tag, images: '../../img/'}, data));
			component.computed = component.computed || {};

		} else {
			component.template = `<${tag}><slot></slot></${tag}>`;
		}

		const
			clone = Object.mixin(true, {}, component);

		staticComponents[name] = clone;
		components[name] = component;

		if (parentBlock) {
			staticComponents[name] = $C(parentBlockStatic).reduce((clone, el, key) => {
				if (Object.isObject(el) && Object.isObject(clone[key])) {
					Object.setPrototypeOf(clone[key], el);

				} else if (key in clone === false) {
					clone[key] = el;
				}

				return clone;
			}, clone);

		} else {
			const
				onInit = component.init,
				onReady = component.ready,
				onDestroy = component.destroy;

			component.init = function () {
				this.async = new Async();
				this.event = new EventEmitter2({wildcard: true});
				this.globalEvent = globalEvent;
				onInit && onInit.call(this, ...arguments);
			};

			component.ready = function () {
				initedBlocks.set(this.$el, this);

				const
					localBlockProps = $C(blockProps[name]).reduce((map, [name, key]) => (map[name] = this[key], map), {});

				this.block = new this.$options.block(Object.assign(localBlockProps, {
					globalEvent,
					async: this.async,
					event: this.event,
					model: this,
					node: this.$el
				}));

				this.initLoad();
				onReady && onReady.call(this, ...arguments);
			};

			component.destroy = function () {
				this.block.destructor();
				onDestroy && onDestroy.call(this, ...arguments);
			};
		}

		lastBlock = undefined;
		lastParentBlock = undefined;

		Vue.component(name, component);
		ModuleDependencies.event.emit(`component.${name}`, {component, name});
	};
}

/**
 * Initializes static blocks on a page
 */
export function init() {
	$C(document.queryAll('[data-init-block]')).forEach((el: Element) => {
		$C(el.dataset.initBlock.split(',')).forEach((name: string) => {
			name = name.trim();
			const params = `${name}-params`.camelize(false);

			if (blocks[name]) {
				new blocks[name](Object.assign({node: el}, el.dataset[params] && json(el.dataset[params])));
			}

			delete el.dataset[params];
		});

		delete el.dataset.initBlock;
	});
}
