/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import Vue from 'vue';
import $ from 'sprint';
import $C from 'collection.js';
import ss from 'snakeskin';
import Async from './async';
import { json } from './parse';

/**
 * Map of available block statuses
 */
export const status = Object.createMap({
	destroyed: -1,
	unloaded: 0,
	loading: 1,
	ready: 2
});

/**
 * Cache for blocks
 */
export const
	blocks = {},
	components = {},
	staticComponents = {},
	blockProps = {};

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
	lastParentBlock = getBlockName(target.__proto__);
	blocks[lastBlock] = target;
}

/**
 * Defines a property as block
 *
 * @decorator
 * @param [name] - property name
 */
export function blockProp(name: ?string) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @blockProp decorator. Need to use @block.');
	}

	return (target, key) => {
		blockProps[lastBlock] = blockProps[lastBlock] || [];
		blockProps[lastBlock].push(name || key);
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
export function model(component: ?Object, tpls: ?Object, data: ?any) {
	return (target) => {
		const
			name = getBlockName(target),
			parent = getBlockName(target.__proto__);

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
			tpls = tpls.init(ss);
			component.template = tpls[name](data);

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
				}

				return clone;
			}, clone);

		} else {
			const onReady = component.ready;
			component.ready = function () {
				const localBlockProps = $C(blockProps[name]).reduce((map, el) =>
					(map[el] = this[el], map), {});

				this.async = new Async();
				this.block = new this.$options.block(Object.mixin(false, localBlockProps, {
					node: this.$el,
					data: this.$data,
					async: this.async,
					model: this
				}));

				if (!this.block.defer) {
					this.block.state = this.block.status.ready;
				}

				if (onReady) {
					onReady.call(this, ...arguments);
				}
			};
		}

		lastBlock = undefined;
		lastParentBlock = undefined;

		Vue.component(name, component);
	};
}

/**
 * Initializes static block on a page
 */
export function init() {
	$('[data-init-block]').each(function () {
		$C(this.dataset['initBlock'].split(',')).forEach((name) => {
			name = name.trim();
			const params = `${name}-params`.camelize(false);

			if (blocks[name]) {
				new blocks[name](Object.mixin(false, {node: this}, this.dataset[params] && this.dataset[params]::json()));
			}

			delete this.dataset[params];
		});

		delete this.dataset['initBlock'];
	});
}
