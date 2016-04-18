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
			type: Object,
			coerce: (val) => new providers[val]
		},

		
	},

	methods: {
		/** @override */
		async initLoad() {
			if (this.dataProvider) {
				this.data = await dataProvider.get()
			}

			this.block.state = this.block.status.ready;
		}
	}
})

@block
export default class iData extends iMessage {}
