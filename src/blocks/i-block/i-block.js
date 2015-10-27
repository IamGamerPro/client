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

const
	mods = {};

@model({
	props: {
		@blockProp
		id: {
			type: String,
			default: uuid.v4
		},

		@blockProp
		name: {
			type: String
		},

		@blockProp
		mods: {
			type: Object,
			default: {}
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
		let $mods = mods[this.$options.name];

		if (!$mods) {
			$mods = this.$options.mods;

			if (this.$options.parent) {
				$mods = Object.mixin(false, {}, this.$options.parent.mods, $mods);
			}

			$mods = mods[this.$options.name] = $C($mods).reduce((map, el, key) => {
				const def = $C(el).get({filter: Object.isArray, mult: false});
				map[key] = def ? def[0] : undefined;
				return map;
			}, {});
		}

		$C($mods).forEach((val, mod) => {
			if (mod in this.mods) {
				return;
			}

			this.mods[mod] = val;
		});
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
