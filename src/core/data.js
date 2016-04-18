'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { c, r, u, d } from './request';
import type { $$requestParams } from './request';

export const
	providers = {},
	cache = {};

/**
 * Adds a data provider to the global cache
 * @decorator
 */
export function provider(target) {
	providers[target.name.camelize(false)] = target;
}

export default class Provider {

	/**
	 * Base URL for requests
   */
	baseUrl: string = '';

	constructor() {
		const {name} = this.constructor;

		if (cache[name]) {
			return cache[name];
		}

		cache[name] = this;
	}

	/**
	 * Adds session headers to request parameters
	 * @param params
	 */
	addSession(params = {}): Object {
		params.headers = Object.assign(params.headers || {}, {
			'X-XSRF-TOKEN': localStorage.getItem('xsrf'),
			'Authorization': `Bearer ${localStorage.getItem('jwt')}`
		});

		return params;
	}

	/**
	 * Get data
	 *
	 * @param data
	 * @param params
	 */
	async get(data?: any, params?: $$requestParams): Promise {
		return r(this.baseUrl, data, this.addSession(params));
	}

	/**
	 * Put data
	 *
	 * @param data
	 * @param params
	 */
	async put(data: any, params?: $$requestParams): Promise {
		return c(this.baseUrl, data, this.addSession(params));
	}

	/**
	 * Update data
	 *
	 * @param data
	 * @param params
	 */
	async upd(data?: any, params?: $$requestParams): Promise {
		return u(this.baseUrl, data, this.addSession(params));
	}

	/**
	 * Delete data
	 *
	 * @param data
	 * @param params
	 */
	async del(data?: any, params?: $$requestParams): Promise {
		return d(this.baseUrl, data, this.addSession(params));
	}
}
