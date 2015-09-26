/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $ from 'sprint';
import { json } from './parse';

export const blocks = {};

/**
 * Adds a block to the global cache
 *
 * @param {string} name - block name
 * @param {!Function} constructor - block constructor
 */
export function addBlock(name, constructor) {
	blocks[name] = constructor;
}

/**
 * Initializes static block on a page
 */
export function init() {
	$('[data-init-block]').each(function () {
		const
			name = this.dataset['initBlock'];

		if (blocks[name]) {
			new blocks[name](Object.merge({node: this}, this.dataset['params']::json()));
		}

		delete this.dataset['initBlock'];
		delete this.dataset['params'];
	});
}
