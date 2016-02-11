'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import Vue from 'vue';
import iBase from '../i-base/i-base';
import { initedBlocks } from '../../core/block';

export default class iPage extends iBase {

	/**
	 * Page model
	 */
	model: ?Vue;

	/**
	 * @override
	 * @param [data] - page data object
	 */
	constructor({data}: {data?: Object} = {}) {
		super(...arguments);
		this.model = new Vue({
			data,
			el: this.node,
			methods: {
				/**
				 * Returns an instance of Vue component by the specified id
				 * @param id
				 */
				find(id: string): Vue | void {
					return initedBlocks.get(document.getElementById(id));
				}
			}
		});
	}
}
