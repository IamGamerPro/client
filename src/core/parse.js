'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

/**
 * Parses the specified string as JSON / JS object and returns the result
 * @param str
 */
export function json(str: ?string): any {
	str = str || '""';

	if (!/^(?:\{|\[|(?:null|true|false|\d+)$)/.test(str)) {
		return undefined;
	}

	try {
		return JSON.parse(str);

	} catch (ignore) {
		try {
			return new Function(`return ${str}`);

		} catch (ignore) {}
	}

	return undefined;
}
