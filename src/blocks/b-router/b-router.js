'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import path from 'path-to-regexp';
import iData from '../i-data/i-data';
import * as tpls from './b-router.ss';
import { mixin, $watch } from '../i-block/i-block';
import { block, model } from '../../core/block';
import { delegate } from '../../core/dom';

@model({
	props: {
		@$watch('setPage', {immediate: true})
		page: {
			type: String,
			default: () => location.pathname
		},

		status: {
			type: Number,
			default: 0
		}
	},

	@mixin
	pages: {
		'/:user': 'profile',
		'/:user/options': 'options',
		'/:user/friends': 'friends',
		'/:user/photos': 'photos',
		'/:user/clans': 'clans'
	},

	methods: {
		/**
		 * Sets the specified page
		 * @param url
		 */
		setPage(url: string) {
			const
				info = this.getPageOpts(url);

			if (info) {
				history.pushState(info, info.name, url);
				ModuleDependencies.get(info.name);

			} else {
				location.href = url;
			}
		},

		/**
		 * Returns an information object of a page by the specified URL
		 * @param [url]
		 */
		getPageOpts(url?: string = location.pathname): ?Object {
			let current = null;

			$C(this.$options.pages).forEach(({page, key}, rgxp: RegExp) => {
				if (rgxp.test(url)) {
					const
						res = rgxp.exec(url);

					let i = 0;
					current = $C(path.parse(key)).reduce((map, el) => {
						if (Object.isObject(el)) {
							map[el.name] = res[++i];
						}

						return map;

					}, {page});

					return false;
				}
			});

			return current;
		}
	},

	init() {
		this.$options.pages = $C(this.$options.pages).reduce((map, page, key) =>
			(map.set(path(key), {page, key}), map), new Map());
	},

	ready() {
		this.async.addNodeEventListener(document, 'click', delegate('a[href^="/"]', (e) => {
			e.preventDefault();
			this.setPage(new URL(e.delegateTarget.href).pathname);
		}));
	}

}, tpls)

@block
export default class bRouter extends iData {}

