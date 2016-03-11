'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $ from 'sprint';
import Vue from 'vue';
import $C from 'collection.js';
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
 * @param [tpls] - object with compiled Snakeskin templates
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

		if (parentBlock) {
			component.mixins = component.mixins || [];
			component.mixins.push(parentBlock);
			component.parentBlock = parentBlockStatic;
		}

		if (tpls) {
			const cache = {};
			component.template = tpls[name].index.call(cache, data);
			component.computed = component.computed || {};

		} else {
			component.template = '<div><slot></slot></div>';
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
				onReady = component.ready,
				onDestroy = component.destroy;

			component.ready = function () {
				initedBlocks.set(this.$el, this);

				const
					localBlockProps = $C(blockProps[name]).reduce((map, [name, key]) => (map[name] = this[key], map), {});

				this.async = new Async();
				this.block = new this.$options.block(Object.assign(localBlockProps, {
					async: this.async,
					model: this,
					node: this.$el
				}));

				if (!this.block.defer) {
					this.block.state = this.block.status.ready;
				}

				if (onReady) {
					onReady.call(this, ...arguments);
				}
			};

			component.destroy = function () {
				this.block.state = this.block.status.destroyed;
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
export function init(): void {
	$('[data-init-block]').each(function () {
		$C(this.dataset['initBlock'].split(',')).forEach((name: string) => {
			name = name.trim();
			const params = `${name}-params`.camelize(false);

			if (blocks[name]) {
				new blocks[name](Object.assign({node: this}, this.dataset[params] && json(this.dataset[params])));
			}

			delete this.dataset[params];
		});

		delete this.dataset['initBlock'];
	});
}
