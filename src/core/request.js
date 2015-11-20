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
	const req = new Promise((resolve, reject) =>
		req.xhr = new Request(url, Object.mixin(false, params, {onLoad: resolve, onError: reject})));

	return req;
}

class Request {
	constructor(
		url,

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

		let requestKey = null;
		if (urlEncodeRequest) {
			requestKey = JSON.stringify([
				method,
				responseType,
				headers,
				data,
				withCredentials,
				user,
				password
			]);

			requests[requestKey] = requests[requestKey] || {};
		}

		function wrap(fn, key) {
			if (!requestKey) {
				return fn;
			}

			const
				req = requests[requestKey];

			if (req[key]) {
				req[key].push(fn);

			} else {
				req[key] = {
					queue: [fn],
					fn() {
						$C(req[key]).forEach((fn) => {
							fn.call(this, arguments);
						});
					}
				};
			}

			return req[key].fn;
		}

		const
			xhr = new XMLHttpRequest();

		xhr.open(method, urlEncodeRequest ? `${url}?${data}` : url, true, user, password);
		xhr.timeout = timeout;
		xhr.responseType = responseType;
		xhr.withCredentials = withCredentials;

		$C(headers).forEach((el, key) =>
			xhr.setRequestHeader(String(key), String(el)));

		$C(upload).forEach((el, key) =>
			xhr.upload[String(key).toLowerCase()] = wrap(el, key));

		$C(upload).forEach(
			(el, key) => xhr[String(key).toLowerCase()] = wrap(el, key),
			{filter: (el) => Object.isFunction(el)}
		);

		xhr.onloadend = function () {
			if (requestKey) {
				delete requests[requestKey];
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
