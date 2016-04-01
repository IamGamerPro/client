'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-crop.ss';
import watch from './modules/watchers';
import methods from './modules/methods';
import { block, model } from '../../core/block';
export type { size } from './modules/methods';

@model({
	props: {
		minWidth: {
			type: Number,
			default: 200
		},

		minHeight: {
			type: Number,
			default: 200
		},

		maxWidth: {
			type: Number,
			default: 600
		},

		maxHeight: {
			type: Number,
			default: 600
		},

		clickWidth: {
			type: Number
		},

		clickHeight: {
			type: Number
		},

		ratio: {
			type: Array,
			default: () => [1, 3]
		},

		ratably: {
			type: Boolean,
			default: false
		},

		freeSelect: {
			type: Boolean,
			default: true
		},

		selectByClick: {
			type: Boolean,
			default: true
		},

		resizeSelect: {
			type: Boolean,
			default: true
		},

		moveSelect: {
			type: Boolean,
			default: true
		}
	},

	watch,
	methods,

	ready() {
		this.initSelect();
		this.$els.clone.append(this.img().cloneNode(false));
	}

}, tpls)

@block
export default class bCrop extends iBlock {}
