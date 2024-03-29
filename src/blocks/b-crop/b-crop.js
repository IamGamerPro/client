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
		src: {
			type: String
		},

		width: {
			type: Number
		},

		height: {
			type: Number
		},

		alt: {
			type: String
		},

		minWidth: {
			type: Number,
			coerce: (val) =>
				val === false ? 0 : val,

			default: 200
		},

		minHeight: {
			type: Number,
			coerce: (val) =>
				val === false ? 0 : val,

			default: 200
		},

		maxWidth: {
			type: Number,
			coerce: (val) =>
				val === false ? Infinity : val,

			default: 600
		},

		maxHeight: {
			type: Number,
			coerce: (val) =>
				val === false ? Infinity : val,

			default: 600
		},

		clickWidth: {
			type: Number,
			default: 200
		},

		clickHeight: {
			type: Number,
			default: 200
		},

		ratio: {
			type: [Array, Boolean],
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
			type: [Number, Boolean],
			default: true
		},

		moveSelect: {
			type: Boolean,
			default: true
		}
	},

	mods: {
		parentProgress: [
			'true',
			['false']
		]
	},

	computed: {
		/**
		 * The link for the original image
		 */
		img(): HTMLImageElement {
			return this.$els.img;
		}
	},

	watch,
	methods

}, tpls)

@block
export default class bCrop extends iBlock {}
