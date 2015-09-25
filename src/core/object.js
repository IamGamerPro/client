/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';

/** @see {$C.extend} */
Object.mixin = $C.extend;

/**
 * Creates an object {key: value, value: key}
 *
 * @template T
 * @param {T} obj - source object
 * @return {T}
 */
Object.createMap = function (obj) {
	return $C(obj).reduce((map, el, key) => (map[key] = el, map[el] = key, map), {});
};
