'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { stringify } from 'qs';
import { c, r, u, d } from './request';
import type { $$requestParams } from './request';

export const
	providers = {},
	cache = {},
	reqCache = {};

/**
 * Adds a data provider to the global cache
 * @decorator
 */
export function provider(target) {
	providers[target.name.camelize(false)] = target;
}

export default class Provider {
	/**
	 * @param [baseUrl] - base URL for requests
	 */
	constructor(baseUrl?: string) {
		if (baseUrl) {
			this.baseURL = baseUrl;

		} else {
			const
				{name} = this.constructor;

			if (cache[name]) {
				return cache[name];
			}

			cache[name] = this;
		}
	}

	/**
	 * Base URL for requests
	 */
	baseURL: string = '';

	/**
	 * Advanced URL for requests
	 */
	advURL: string = '';

	/**
	 * Temporary URL for requests
	 */
	tmpURL: string = '';

	/**
	 * Cache time
	 */
	cacheTime: number = (10).seconds();

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
	 * Updates user session
	 * @param req - request object
	 */
	updateSession(req: Promise<XMLHttpRequest>): Promise<XMLHttpRequest> {
		(async () => {
			const
				res = await req;

			const
				jwt = res.getResponseHeader('X-JWT-TOKEN'),
				xsrf = res.getResponseHeader('X-XSRF-TOKEN');

			if (jwt) {
				localStorage.setItem('jwt', jwt);
			}

			if (xsrf) {
				localStorage.setItem('xsrf', xsrf);
			}
		})();

		return req;
	}

	/**
	 * Sets advanced URL for requests OR returns full URL
	 * @param [value]
	 */
	url(value?: string): Provider | string {
		if (!value) {
			const tmp = `${this.tmpURL || this.baseURL}/${this.advURL}`;
			this.advURL = '';
			this.tmpURL = '';
			return tmp;
		}

		this.advURL = value;
		return this;
	}

	/**
	 * Sets base temporary URL for requests
	 * @param [value]
	 */
	base(value: string): Provider {
		this.tmpURL = value;
		return this;
	}

	/**
	 * Gets data
	 *
	 * @param [data]
	 * @param [params]
	 */
	get(data?: any, params?: $$requestParams): Promise<XMLHttpRequest> {
		const
			url = `${this.url()}?${stringify(data || {})}`;

		if (!reqCache[url]) {
			setTimeout(() => {
				delete reqCache[url];
			}, this.cacheTime);
		}

		if (reqCache[url]) {
			return reqCache[url];
		}

		return this.updateSession(reqCache[url] = r(this.baseURL, data, this.addSession(params)));
	}

	/**
	 * Puts data
	 *
	 * @param data
	 * @param [params]
	 */
	put(data: any, params?: $$requestParams): Promise<XMLHttpRequest> {
		return this.updateSession(c(this.url(), data, this.addSession(params)));
	}

	/**
	 * Updates data
	 *
	 * @param [data]
	 * @param [params]
	 */
	upd(data?: any, params?: $$requestParams): Promise<XMLHttpRequest> {
		return this.updateSession(u(this.url(), data, this.addSession(params)));
	}

	/**
	 * Deletes data
	 *
	 * @param [data]
	 * @param [params]
	 */
	del(data?: any, params?: $$requestParams): Promise<XMLHttpRequest> {
		return this.updateSession(d(this.url(), data, this.addSession(params)));
	}
}
