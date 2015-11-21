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
	let xhr;

	const req = new Promise((resolve, reject) => {
		xhr = new Request(url, Object.mixin(false, params || {}, {onLoad: resolve, onError: reject}));
		return xhr;
	});

	req.xhr = xhr;
	return req;
}

/**
 * Destroys XMLHttpRequest
 */
XMLHttpRequest.prototype.destroy = function () {
	this.destroyed = true;
	return this.abort(...arguments);
};

const abort = XMLHttpRequest.prototype.abort;
XMLHttpRequest.prototype.abort = function () {
	this.aborted = true;
	return abort.call(this, ...arguments);
};

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
			if (cb) {
				cb.queue.set(fn, key);

			} else {
				cb = req.cbs[key] = {
					queue: new Map(),
					fn() {
						if (xhr.destroyed && !cb.queue.size) {
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
			xhr = req && req.xhr ? req.xhr : new XMLHttpRequest();

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
			return xhr;
		}

		xhr.open(method, url + (urlEncodeRequest && data ? `?${data}` : ''), true, user, password);
		xhr.timeout = timeout;
		xhr.responseType = responseType;
		xhr.withCredentials = withCredentials;

		$C(headers).forEach((el, key: string) =>
			xhr.setRequestHeader(key, String(el)));

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

		return xhr;
	}
}
