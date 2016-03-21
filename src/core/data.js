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

	async get(id: string, data?: any, params?: $$requestParams): Promise {
		return r(`${this.baseUrl}/${id}`, data, params);
	}

	async put(data: any, params?: $$requestParams): Promise {
		return c(this.baseUrl, data, params);
	}

	async upd(id: string, data?: any, params?: $$requestParams): Promise {
		return u(`${this.baseUrl}/${id}`, data, params);
	}

	async del(id: string, data?: any, params?: $$requestParams): Promise {
		return d(`${this.baseUrl}/${id}`, data, params);
	}

	async find(query: any, params?: $$requestParams): Promise {
		return r(`${this.baseUrl}/find`, query, params);
	}
}
