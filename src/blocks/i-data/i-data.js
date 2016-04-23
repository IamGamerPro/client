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
			this.blockStatus = this.blockStatus.loading;

			if (this.dataProvider) {
				this.setMod('progress', true);
				this.data = (await this.async.setRequest({
					label: 'initLoad',
					req: this.$$dataProvider.get(...this.getParams('get'))
				})).response;

				this.setMod('progress', false);
			}

			this.blockStatus = this.blockStatus.ready;
		},

		/**
		 * Returns request parameters for the specified method
		 * @param method
		 */
		getParams(method: string): Array {
			return [].concat(this.requestParams && this.requestParams[method] || []);
		},

		/**
		 * Returns default texts for server errors
		 * @param err
		 */
		getDefaultErrText(err: Object): string {
			let msg = '';

			if (err.type !== 'abort') {
				switch (err.type) {
					case 'timeout':
						msg = i18n('Сервер не отвечает');
						break;

					default:
						msg = i18n('Неизвестная ошибка сервера');
				}
			}

			return msg;
		}
	}
})

@block
export default class iData extends iMessage {}
