/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

/**
 * Parses a string as JSON / JS object and returns the result (can be used with ::)
 * @param [val] - source string
 */
export function json(val: ?string): ?Object {
	const str = val || this || '';

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
