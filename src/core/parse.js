/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

/**
 * Parses a string as JSON or JS object and returns the result
 *
 * @param {string=} [opt_val] - source string
 * @returns {(Object|undefined)}
 */
export function json(opt_val) {
	const str = opt_val || this || '';

	if (!/^(?:\{|\[|(?:null|true|false|\d+)$)/.test(str)) {
		return undefined;
	}

	try {
		return JSON.parse(str);

	} catch (ignore) {
		try {
			return new Function(`return ${str || '""'}`);

		} catch (ignore) {}
	}

	return undefined;
}
