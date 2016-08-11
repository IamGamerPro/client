'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-router.ss';
import { field, params } from '../i-block/i-block';
import { model } from '../../core/block';
import { delegate } from '../../core/dom';

const
	$C = require('collection.js'),
	path = require('path-to-regexp');

@model(tpls)
export default class bRouter extends iData {
	/**
	 * Initial page
	 */
	@params({default: () => location.pathname})
	initPage: string;

	/**
	 * Page store
	 */
	@field()
	pageStore: string;

	/**
	 * Page load status
	 */
	@field(0)
	status: number;

	/**
	 * Router paths
	 */
	static pages = {
		'p-profile': '/:user',
		'p-profile-options': '/:user/options'
	};

	/**
	 * Alias for $options.pages
	 */
	get pages(): Object {
		return this.$options.pages;
	}

	/**
	 * Current page
	 */
	get page(): string {
		return this.pageStore;
	}

	/**
	 * Sets a new page
	 */
	set page(value: string) {
		this.pageStore = value;

		const
			info = this.getPageOpts(value);

		if (info) {
			if (location.pathname !== value) {
				history.pushState(info, info.page, value);
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
			location.href = value;
		}
	}

	/**
	 * Returns an information object of a page by the specified URL
	 * @param [url]
	 */
	getPageOpts(url?: string = location.pathname): ?Object {
		let current = null;

		$C(this.pages).forEach(({pattern, rgxp}, page, data, o) => {
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

				return o.break;
			}
		});

		return current;
	}

	/** @override */
	beforeCreate() {
		this.pages.set((pattern, page) => ({
			page,
			pattern,
			rgxp: path(pattern)
		}));
	}

	/** @override */
	mounted() {
		this.page = this.initPage;
		this.async.addNodeEventListener(document, 'click', delegate('a[href^="/"]', (e) => {
			e.preventDefault();
			this.page = new URL(e.delegateTarget.href).pathname;
		}));
	}
}

