'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iBase from '../i-base/i-base';
import { initedBlocks } from '../i-block/i-block';

const
	Vue = require('vue');

export default class iPage extends iBase {
	/**
	 * Vue component
	 */
	component(): Object {
		return {
			methods: {
				/**
				 * Returns an instance of Vue component by the specified selector
				 * @param selector
				 */
				$(selector: string): ?Vue {
					const $0 = document.query(selector);
					return initedBlocks.get($0.closest('.i-block-helper'));
				}
			}
		};
	}

	/**
	 * @override
	 * @param [params] - page params
	 */
	constructor(params?: Object) {
		super(params = Object.assign({data: {}}, params));
		this.model = new Vue(Object.assign(this.component(), {
			el: this.node,
			data: params.data
		}));
	}
}
