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

export const blocks = {};

/**
 * Adds a block to the global cache
 *
 * @decorator
 * @param {string} name - block name
 * @param {Object=} [opt_component] - Vue component
 * @param {Object=} [opt_tpls] - object with compiled Snakeskin templates
 * @param {*=} [opt_data] - data for templates
 */
export function block(name, opt_component, opt_tpls, opt_data) {
	return (target) => {
		blocks[name] = target;

		if (opt_component) {
			if (opt_tpls) {
				const tpls = opt_tpls.init(ss);
				opt_component.template = tpls[name](opt_data);
			}

			const
				onReady = opt_component.ready;

			opt_component.ready = function () {
				this.block = new target({node: this.$el, data: this.$data, model: this});

				if (onReady) {
					onReady.call(this, ...arguments);
				}
			};

			Vue.component(name, opt_component);
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
	});
}
