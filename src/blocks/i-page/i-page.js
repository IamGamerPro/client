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
					return initedBlocks.get($0.currentOrClosest('.i-block-helper'));
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
