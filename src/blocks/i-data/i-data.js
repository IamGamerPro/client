'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iMessage from '../i-message/i-message';
import { $watch } from '../i-block/i-block';
import { block, model } from '../../core/block';
import { providers } from '../../core/data';

@model({
	props: {
		data: {
			type: Object
		},

		@$watch('initLoad')
		dataProvider: {
			type: String
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

	computed: {
		/**
		 * Request parameters
		 */
		requestParams(): Object {
			return {};
		}
	},

	methods: {
		/** @override */
		async initLoad() {
			this.block.state = this.block.status.ready;

			if (this.dataProvider) {
				this.setMod('progress', true);
				this.data = (await this.async.setRequest({
					label: 'initLoad',
					req: this.$$dataProvider.get(...this.getParams('get'))
				})).response;

				this.setMod('progress', false);
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
