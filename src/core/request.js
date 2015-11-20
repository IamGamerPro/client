/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import qs from 'qs';

const
	requests = {};

/**
 * Creates new AJAX request for the specified URL and returns a promise
 *
 * @param url
 * @param params
 */
export default function request(url: string, params: Object): Promise {
	return new Promise((resolve, reject) =>
		new Request(url, Object.mixin(false, params || {}, {onLoad: resolve, onError: reject})));
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
				return function (e) {
					fn.call(this, e.target, ...arguments);
				};
			}

			let cb = req.cbs[key];
			if (cb) {
				cb.queue.push(fn);

			} else {
				cb = req.cbs[key] = {
					queue: [fn],
					fn(e) {
						$C(cb.queue).forEach((fn) => {
							fn.call(this, e.target, ...arguments);
						});
					}
				};
			}

			return cb.fn;
		}

		const
			newRequest = Boolean(!req || !req.xhr),
			xhr = req && req.xhr ? req.xhr : new XMLHttpRequest();

		if (req) {
			req.xhr = xhr;
		}

		$C(upload).forEach((el, key) =>
			xhr.upload[String(key).toLowerCase()] = wrap(el, key));

		$C(arguments[1]).forEach(
			(el, key) => xhr[String(key).toLowerCase()] = wrap(el, key),
			{filter: (el) => Object.isFunction(el)}
		);

		if (!newRequest) {
			return xhr;
		}

		xhr.open(method, url + (urlEncodeRequest && data ? `?${data}` : ''), true, user, password);
		xhr.timeout = timeout;
		xhr.responseType = responseType;
		xhr.withCredentials = withCredentials;

		$C(headers).forEach((el, key) =>
			xhr.setRequestHeader(String(key), String(el)));

		xhr.onloadend = function () {
			if (reqKey) {
				delete requests[reqKey];
			}

			onLoadEnd && onLoadEnd.call(this, ...arguments);
		};

		setTimeout(
			() => xhr.send(urlEncodeRequest ? undefined : data),
			defer
		);

		return xhr;
	}
}
