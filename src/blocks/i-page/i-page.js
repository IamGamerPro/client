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
	 * @param [params] - page params
	 */
	constructor(params?: Object = {}) {
		super(params);
		this.model = new Vue({
			data: params.data || {},
			el: this.node,
			methods: {
				/**
				 * Returns an instance of Vue component by the specified selector
				 * @param selector
				 */
				$(selector: string): ?Vue {
					const $0 = document.query(selector);
					return initedBlocks.get($0.classList.contains('i-block-helper') ? $0 : $0.closest('.i-block-helper'));
				},

				/**
				 * Returns true if a block from an event target has the specified modifier
				 *
				 * @param e - event object
				 * @param name - modifier name
				 * @param value - modifier value
				 */
				if(e: Event, name?: string = 'disabled', value?: any = 'false'): boolean {
					const
						$0 = e.target,
						component = initedBlocks.get($0.classList.contains('i-block-helper') ? $0 : $0.closest('.i-block-helper'));

					if (component) {
						return component.block.getMod(name) === String(value);
					}

					return false;
				}
			}
		});
	}
}
