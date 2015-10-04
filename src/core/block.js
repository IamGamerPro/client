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
import { json } from './parse';

/**
 * Map of available block statuses
 */
export const status = Object.createMap({
	unload: 0,
	loading: 1,
	loaded: 2,
	ready: 3
});

/**
 * Cache for blocks
 */
export const
	blocks = {},
	components = {};

/**
 * Adds a block to the global cache
 *
 * @decorator
 * @param name - block name
 * @param [component] - Vue component
 * @param [tpls] - object with compiled Snakeskin templates
 * @param [data] - data for templates
 */
export function block(name: string, component: ?Object, tpls: ?Object, data: ?any) {
	return (target) => {
		blocks[name] = target;

		if (component) {
			components[name] = component = Object.mixin(true, {}, components[target.__proto__.name.dasherize()], component, {
				props: {
					id: {
						type: String,
						default: uuid.v4
					}
				}
			});

			if (tpls) {
				tpls = tpls.init(ss);
				component.template = tpls[name](data);
			}

			const onReady = component.ready;
			component.ready = function () {
				this.block = new target({id: this.$data.id, node: this.$el, data: this.$data, model: this});

				if (onReady) {
					onReady.call(this, ...arguments);
				}
			};

			Vue.component(name, component);
		}
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
		this.classList.add('i-block-helper');
	});
}
