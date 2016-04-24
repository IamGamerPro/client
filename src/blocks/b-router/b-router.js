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
		'p-profile': '/:user',
		'p-profile-options': '/:user/options',
		'p-friends': '/:user/friends',
		'p-photos': '/:user/photos',
		'p-clans': '/:user/clans',
		'p-pm': '/:user/pm'
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
				if (location.pathname !== url) {
					history.pushState(info, info.page, url);
				}

				let i = 0;
				ModuleDependencies.event.on(`component.${info.page}.loading`, this.async.setProxy({
					label: 'component',
					single: false,
					fn: ({packages}) => {
						this.status = (++i * 100) / packages;
						if (i === packages) {
							this.$root.pageInfo = info;
						}
					}
				}));

				ModuleDependencies.get(info.page);

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

			$C(this.$options.pages).forEach(({pattern, rgxp}, page) => {
				if (rgxp.test(url)) {
					const
						res = rgxp.exec(url);

					let i = 0;
					current = $C(path.parse(pattern)).reduce((map, el) => {
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
		$C(this.$options.pages).forEach((pattern, page, data) => {
			data[page] = {
				page,
				pattern,
				rgxp: path(pattern)
			};
		});
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

