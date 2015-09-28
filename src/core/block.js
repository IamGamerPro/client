/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $ from 'sprint';
import $C from 'collection.js';
import { json } from './parse';

export const blocks = {};

/**
 * Adds a block to the global cache
 *
 * @decorator
 * @param {string} name - block name
 */
export function block(name) {
	return (target) => blocks[name] = target;
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
