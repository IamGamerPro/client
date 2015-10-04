/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { block } from '../../core/block';
import iBlock from '../i-block/i-block';
import * as tpls from './b-icon.ss';

@block({
	props: {
		value: {
			type: String,
			required: true
		},

		title: {
			type: String,
			required: true
		},

		spin: {
			type: Boolean,
			default: false
		},

		symbols: {
			default: {
				'desktop': '',
				'search': '',
				'envelope': '',
				'envelope-o': '',
				'comment-o': '',
				'comments-o': '',
				'camera': '',
				'film': '',
				'picture': '',
				'upload': '',
				'user': '',
				'heart': '',
				'check': '',
				'remove-sign': '',
				'remove': '',
				'thumb-up': '',
				'thumb-down': '',
				'pencil': '',
				'save': '',
				'hand-o-up': '',
				'cog': '',
				'cogs': '',
				'spinner': '',
				'sun': '',
				'time': '',
				'refresh': '',
				'sort': '',
				'sort-up': '',
				'sort-down': '',
				'undo': '',
				'caret-up': '',
				'caret-down': '',
				'rotate-left': '',
				'rotate-right': ''
			}
		}
	}
}, tpls)

export default class bIcon extends iBlock {}
