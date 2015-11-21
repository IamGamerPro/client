/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import uuid from 'uuid';
import qs from 'qs';

const
	requests = {},
	cache = {};

/**
 * Creates new Ajax request for the specified URL and returns a promise
 *
 * @param url
 * @param params
 */
export default function request(url: string, params: Object): Promise {
	let res;

	const promise = new Promise((resolve, reject) => {
		res = new Request(url, Object.mixin(false, params || {}, {onLoad: resolve, onError: reject}));
		return res.xhr;
	});

	let {xhr, id, req} = res;

	promise.destroy = function () {
		if (!req || req.i === 1) {
			xhr.destroyed = true;
			xhr.abort();

		} else {
			req.i--;
			$C(cache[id]).forEach((fn, key) => {
				req.cbs[key].queue.delete(fn);
			});
		}
	};

	promise.abort = function () {
		if (!req || req.i === 1) {
			xhr.aborted = true;
			xhr.abort();

		} else {
			req.i--;
			$C(cache[id]).forEach((fn, key: string) => {
				if (key === 'onAbort') {
					fn(xhr);

				} else {
					req.cbs[key].queue.delete(fn);
				}
			});
		}
	};

	return promise;
}

class Request {
	constructor(
		url,

		{
			method = 'GET',
			timeout = (25).seconds(),
			defer = 0,
			responseType = 'text',
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
		}

	) {
		let data = body || '';

		if (Object.isString(data)) {
			data = {data};
		}

		const
			id = uuid.v4(),
			urlEncodeRequest = {GET: 1, HEAD: 1}[method];

		if (urlEncodeRequest) {
			data = qs.stringify(body);

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
				i: 0,
				xhr: null,
				cbs: {}
			};
		}

		function wrap(fn, key) {
			if (!req) {
				return function () {
					if (xhr.destroyed) {
						return;
					}

					fn.call(this, xhr, ...arguments);
				};
			}

			let cb = req.cbs[key];

			cache[id] = cache[id] || {};
			cache[id][key] = fn;

			if (cb) {
				cb.queue.set(fn, key);

			} else {
				cb = req.cbs[key] = {
					queue: new Map(),
					fn() {
						if (xhr.destroyed) {
							return;
						}

						$C(cb.queue).forEach((key, fn: Function) => {
							fn.call(this, xhr, ...arguments);
						});
					}
				};

				cb.queue.set(fn, key);
			}

			return cb.fn;
		}

		const
			newRequest = Boolean(!req || !req.xhr),
			xhr = req && req.xhr ? req.xhr : new XMLHttpRequest(),
			res = {xhr, id, req};

		req.i++;
		if (req) {
			req.xhr = xhr;
		}

		$C(upload).forEach((el, key: string) =>
			xhr.upload[key.toLowerCase()] = wrap(el, key));

		$C(arguments[1]).forEach(
			(el, key: string) => xhr[key.toLowerCase()] = wrap(el, key),
			{filter: (el) => Object.isFunction(el)}
		);

		if (!newRequest) {
			return res;
		}

		xhr.open(method, url + (urlEncodeRequest && data ? `?${data}` : ''), true, user, password);
		xhr.timeout = timeout;
		xhr.responseType = responseType;
		xhr.withCredentials = withCredentials;

		$C(headers).forEach((el, key: string) =>
			xhr.setRequestHeader(key, String(el)));

		onLoadEnd = xhr.onloadend;
		xhr.onloadend = function () {
			if (reqKey) {
				delete requests[reqKey];
			}

			onLoadEnd && onLoadEnd.call(this, ...arguments);
		};

		setTimeout(
			() => {
				if (xhr.destroyed || xhr.aborted) {
					return;
				}

				xhr.send(urlEncodeRequest ? undefined : data);
			},

			defer
		);

		return res;
	}
}
