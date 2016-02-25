'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import Vue from 'vue';
import $ from 'sprint';
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
				 * Returns an instance of Vue component by the specified selector
				 * @param selector
				 */
				$(selector: string): ?Vue {
					const target = $(selector);
					return initedBlocks.get(
						(target.hasClass('i-block-helper') ? target : target.closest('.i-block-helper')).get(0)
					);
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
						target = $(e.target),
						component = initedBlocks.get(
							(target.hasClass('i-block-helper') ? target : target.closest('.i-block-helper')).get(0)
						);

					if (component) {
						return component.block.getMod(name) === String(value);
					}

					return false;
				}
			}
		});
	}
}
