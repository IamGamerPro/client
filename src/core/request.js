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

			onError() {
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

		return res.transport;
	});

	promise.abort = function () {
		let {transport, req} = res;

		if (!req || req.i === 1) {
			transport.aborted = true;
			transport.readyState >= 1 && transport.abort();

		} else {
			req.i--;
			$C(cache[res.id]).forEach((fn, key: string) => {
				if (key === 'onAbort') {
					fn(transport);

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
			timeout = (25).seconds(),
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
				transport: null
			};
		}

		function wrap(fn, key) {
			const hMap = {
				onAbort: true,
				onLoadEnd: true
			};

			if (!req) {
				return function () {
					if (transport.aborted && !hMap[key]) {
						return;
					}

					fn.call(this, transport, ...arguments);
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
						if (transport.aborted && !hMap[key]) {
							return;
						}

						$C(cb.queue).forEach((key, fn: Function) => {
							fn.call(this, transport, ...arguments);
						});
					},

					queue: new Map()
				};

				cb.queue.set(fn, key);
			}

			return cb.fn;
		}

		const
			newRequest = Boolean(!req || !req.transport),
			transport = req && req.transport ? req.transport : new XMLHttpRequest(),
			res = {id, req, transport};

		if (req) {
			req.i++;
			req.transport = transport;
		}

		$C(upload).forEach((el, key: string) =>
			transport.upload[key.toLowerCase()] = wrap(el, key));

		$C(arguments[1]).forEach(
			(el, key: string) => transport[key.toLowerCase()] = wrap(el, key),
			{filter: (el) => Object.isFunction(el)}
		);

		if (!newRequest) {
			return res;
		}

		transport.open(method, url + (urlEncodeRequest && data ? `?${data}` : ''), true, user, password);
		transport.timeout = timeout;
		transport.responseType = responseType;
		transport.withCredentials = withCredentials;

		$C(headers).forEach((el, key: string) =>
			transport.setRequestHeader(key, String(el)));

		onLoadEnd = transport.onloadend;
		transport.onloadend = function () {
			delete cache[id];

			if (reqKey) {
				delete requests[reqKey];
			}

			onLoadEnd && onLoadEnd.call(this, ...arguments);
		};

		setTimeout(
			() => {
				transport.send(urlEncodeRequest ? undefined : data);
				transport.aborted && transport.abort();
			},

			defer
		);

		return res;
	}
}
