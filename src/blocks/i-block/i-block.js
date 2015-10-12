/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBase from '../i-base/i-base';
import uuid from '../../../bower_components/uuid';
import $C from 'collection.js';
import { block, model, blockProp } from '../../core/block';

@model({
	props: {
		@blockProp
		id: {
			type: String,
			default: uuid.v4
		},

		@blockProp
		tag: {
			type: String,
			default: 'div'
		},

		@blockProp
		name: {
			type: String
		},

		@blockProp
		mods: {
			type: Object
		}
	},

	mods: {
		size: [
			'xxs',
			'xs',
			's',
			['m'],
			'xs',
			'xxs'
		],

		progress: [
			'true',
			['false']
		],

		disabled: [
			'true',
			['false']
		],

		block: [
			'true',
			['false']
		]
	},

	sizeTo: {
		gt: {
			xxl: 'xxl',
			xl: 'xxl',
			l: 'xl',
			m: 'l',
			undefined: 'l',
			s: 'm',
			xs: 's',
			xxs: 'xs'
		},

		lt: {
			xxl: 'xl',
			xl: 'l',
			l: 'm',
			m: 's',
			undefined: 's',
			s: 'xs',
			xs: 'xxs',
			xxs: 'xxs'
		}
	},

	created() {
		if (this.$options.parent) {
			this.$options.mods = Object.mixin(false, {}, this.$options.parent.mods, this.$options.mods);
		}
	}
})

@block
export default class iBlock extends iBase {

	/**
	 * Block model
	 */
	model: ?Vue;

	/**
	 * Block data
	 */
	data: ?Object;

	/**
	 * @override
	 * @param model - model instance
	 * @param [data] - model data object
	 */
	constructor({model, data}: {model: Vue, data: Object} = {}) {
		super(...arguments);
		this.model = model;
		this.data = data;
	}
}
