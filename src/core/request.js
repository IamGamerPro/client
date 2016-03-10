'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import uuid from 'uuid';
import { stringify } from 'qs';

const
	requests = {},
	cache = {};

export default request;
export type $$requestParams = {
	method?: string,
	timeout?: number,
	defer?: number,
	responseType?: string,
	headers?: Object,
	body?: any,
	withCredentials?: boolean,
	user?: string,
	password?: string,
	onAbort(transport: any, ...args: any): void,
	onTimeout(transport: any, ...args: any): void,
	onError(transport: any, ...args: any): void,
	onLoad(transport: any, ...args: any): void,
	onLoadStart(transport: any, ...args: any): void,
	onLoadEnd(transport: any, ...args: any): void,
	onProgress(transport: any, ...args: any): void,
	upload(transport: any, ...args: any): void
};

/**
 * Creates a new request for the specified URL and returns a promise
 *
 * @param url - url for the request
 * @param params - additional parameters
 */
function request(url: string, params?: $$requestParams): Promise {
	let res = undefined;

	const promise = new Promise((resolve, reject) => {
		res = new Request(url, Object.assign({}, params, {
			onAbort() {
				params.onAbort && params.onAbort.call(this, ...arguments);
				reject({args: arguments, type: 'abort'});
			},

			onError(transport) {
				params.onError && params.onError.call(this, ...arguments);
				reject({args: arguments, type: 'error'});
			},

			onLoad(transport) {
				params.onLoad && params.onLoad.call(this, ...arguments);
				resolve(transport);
			},

			onTimeout() {
				params.onTimeout && params.onTimeout.call(this, ...arguments);
				reject({args: arguments, type: 'timeout'});
			}
		}));

		return res.trans;
	});

	let {trans, id, req} = res;

	promise.destroy = function () {
		if (!req || req.i === 1) {
			trans.destroyed = true;
			trans.abort();

		} else {
			req.i--;
			$C(cache[id]).forEach((fn, key) => {
				req.cbs[key].queue.delete(fn);
			});
		}
	};

	promise.abort = function () {
		if (!req || req.i === 1) {
			trans.aborted = true;
			trans.abort();

		} else {
			req.i--;
			$C(cache[id]).forEach((fn, key: string) => {
				if (key === 'onAbort') {
					fn(trans);

				} else {
					req.cbs[key].queue.delete(fn);
				}
			});
		}
	};

	return promise;
}

/**
 * Creates new CREATE request for the specified URL and returns a promise
 *
 * @param url
 * @param body
 * @param params
 */
export function c(url: string, body?: any, params?: $$requestParams): Promise {
	return request(url, Object.assign({}, params, {body, method: 'POST'}));
}

/**
 * Creates new READ request for the specified URL and returns a promise
 *
 * @param url
 * @param body
 * @param params
 */
export function r(url: string, body?: any, params?: $$requestParams): Promise {
	return request(url, Object.assign({}, params, {body, method: 'GET'}));
}

/**
 * Creates new UPDATE request for the specified URL and returns a promise
 *
 * @param url
 * @param body
 * @param params
 */
export function u(url: string, body?: any, params?: $$requestParams): Promise {
	return request(url, Object.assign({}, params, {body, method: 'PUT'}));
}

/**
 * Creates new DELETE request for the specified URL and returns a promise
 *
 * @param url
 * @param body
 * @param params
 */
export function d(url: string, body:? any, params?: $$requestParams): Promise {
	return request(url, Object.assign({}, params, {body, method: 'DELETE'}));
}

class Request {
	constructor(
		url: string,

		{
			method = 'GET',
			timeout = (4).seconds(),
			defer = 0,
			responseType = 'json',
			headers,
			body,
			withCredentials,
			user,
			password,
			onAbort,
			onTimeout,
			onError,
			onLoad,
			onLoadStart,
			onLoadEnd,
			onProgress,
			upload
		}: $$requestParams

	) {
		let data = body || '';

		if (Object.isString(data)) {
			data = {data};
		}

		const
			id = uuid.v4(),
			urlEncodeRequest = {GET: 1, HEAD: 1}[method];

		if (urlEncodeRequest) {
			data = stringify(body);

		} else if (Object.isObject(body)) {
			data = JSON.stringify(data);
		}

		let
			reqKey = null,
			req;

		if (urlEncodeRequest) {
			reqKey = JSON.stringify([
				url,
				method,
				responseType,
				headers,
				data,
				withCredentials,
				user,
				password
			]);

			req = requests[reqKey] = requests[reqKey] || {
				cbs: {},
				i: 0,
				trans: null
			};
		}

		function wrap(fn, key) {
			if (!req) {
				return function () {
					if (trans.destroyed) {
						return;
					}

					fn.call(this, trans, ...arguments);
				};
			}

			let cb = req.cbs[key];

			cache[id] = cache[id] || {};
			cache[id][key] = fn;

			if (cb) {
				cb.queue.set(fn, key);

			} else {
				cb = req.cbs[key] = {
					fn() {
						if (trans.destroyed) {
							return;
						}

						$C(cb.queue).forEach((key, fn: Function) => {
							fn.call(this, trans, ...arguments);
						});
					},

					queue: new Map()
				};

				cb.queue.set(fn, key);
			}

			return cb.fn;
		}

		const
			newRequest = Boolean(!req || !req.trans),
			trans = req && req.trans ? req.trans : new XMLHttpRequest(),
			res = {id, req, trans};

		if (req) {
			req.i++;
			req.trans = trans;
		}

		$C(upload).forEach((el, key: string) =>
			trans.upload[key.toLowerCase()] = wrap(el, key));

		$C(arguments[1]).forEach(
			(el, key: string) => trans[key.toLowerCase()] = wrap(el, key),
			{filter: (el) => Object.isFunction(el)}
		);

		if (!newRequest) {
			return res;
		}

		trans.open(method, url + (urlEncodeRequest && data ? `?${data}` : ''), true, user, password);
		trans.timeout = timeout;
		trans.responseType = responseType;
		trans.withCredentials = withCredentials;

		$C(headers).forEach((el, key: string) =>
			trans.setRequestHeader(key, String(el)));

		onLoadEnd = trans.onloadend;
		trans.onloadend = function () {
			if (reqKey) {
				delete requests[reqKey];
			}

			onLoadEnd && onLoadEnd.call(this, ...arguments);
		};

		setTimeout(
			() => {
				if (trans.destroyed || trans.aborted) {
					return;
				}

				trans.send(urlEncodeRequest ? undefined : data);
			},

			defer
		);

		return res;
	}
}
