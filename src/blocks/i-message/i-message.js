/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock, { bindToParam } from '../i-block/i-block';
import { block, model } from '../../core/block';

@model({
	props: {
		infoMsg: {
			type: String
		},

		errorMsg: {
			type: String
		}
	},

	mods: {
		@bindToParam('infoMsg')
		showInfo: [
			'true',
			['false']
		],

		@bindToParam('errorMsg')
		showError: [
			'true',
			['false']
		]
	}
})

@block
export default class iMessage extends iBlock {}
