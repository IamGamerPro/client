'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import Vue from 'vue';
import uuid from 'uuid';
import $C from 'collection.js';

import iBase from '../i-base/i-base';
import { block, model, blockProp, lastBlock } from '../../core/block';

const
	binds = {},
	mods = {};

export const
	PARENT_MODS = {};

/**
 * Binds a modifier to the specified parameter
 *
 * @decorator
 * @param param - parameter name
 * @param [fn] - converter function
 * @param [opts] - additional options
 */
export function bindToParam(param: string, fn?: Function = Boolean, opts?: Object) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @bindToParam decorator. Need to use @block.');
	}

	return (target, key) => {
		binds[lastBlock] = (binds[lastBlock] || []).concat(function () {
			this.bindModToParam(key, param, fn, opts);
		});
	};
}

@model({
	props: {
		@blockProp('id')
		blockId: {
			type: String,
			default: uuid.v4
		},

		@blockProp('name')
		blockName: {
			type: String
		},

		@blockProp()
		mods: {
			type: Object,
			default: {}
		}
	},

	methods: {
		/**
		 * Binds a modifier to the specified parameter
		 *
		 * @param mod - modifier name
		 * @param param - parameter name
		 * @param [fn] - converter function
		 * @param [opts] - additional options
		 */
		bindModToParam(mod: string, param: string, fn?: Function = Boolean, opts?: Object) {
			opts = Object.assign({immediate: true}, opts);
			this.$watch(param, (val) => this.block.setMod(mod, fn(val)), opts);
		}
	},

	mods: {
		theme: [
			['default']
		],

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
		],

		focused: [
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
		const
			opts = this.$options,
			parentMods = opts.parentBlock && opts.parentBlock.mods;

		let
			$mods = mods[opts.name];

		if (!$mods) {
			$mods = opts.mods;

			if (parentMods) {
				$C($mods = Object.mixin(false, {}, parentMods, $mods)).forEach((mod, key) => {
					$C(mod).forEach((el, i) => {
						if (el === PARENT_MODS) {
							if (parentMods[key]) {
								const
									parent = parentMods[key].slice(),
									hasDefault = $C(el).some((el) => Object.isArray(el));

								if (hasDefault) {
									$C(parent).forEach((el, i) => {
										if (Object.isArray(el)) {
											parent[i] = el[0];
											return false;
										}
									});
								}

								mod.splice(i, 1, ...parent);
								return false;
							}
						}
					});
				});
			}

			$mods = mods[opts.name] = $C($mods).reduce((map, el, key) => {
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
	},

	ready() {
		let obj = this.$options;
		while (obj) {
			$C(binds[obj.name]).forEach((fn) => fn.call(this));
			obj = obj.parentBlock;
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
	constructor({model, data}: {model: Vue, data?: Object} = {}) {
		super(...arguments);
		this.model = model;
		this.data = data;
	}
}
