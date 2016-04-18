'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iMessage from '../i-message/i-message';
import { block, model } from '../../core/block';
import { providers } from '../../core/data';

@model({
	props: {
		data: {
			type: Object
		},

		dataProvider: {
			type: String
		},

		requestParams: {
			type: Object
		}
	},

	watch: {
		dataProvider: {
			immediate: true,
			handler(val) {
				if (val) {
					this.$$dataProvider = new providers[val]();

				} else {
					this.$$dataProvider = null;
				}
			}
		}
	},

	methods: {
		/** @override */
		async initLoad() {
			if (this.dataProvider) {
				this.data = await this.$$dataProvider.get(...this.getParams('get'))
			}

			this.block.state = this.block.status.ready;
		},

		/**
		 * Returns request parameters for the specified method
		 * @param method
		 */
		getParams(method: string): Array {
			return [].concat(this.requestParams && this.requestParams[method] || []);
		}
	}
})

@block
export default class iData extends iMessage {}
