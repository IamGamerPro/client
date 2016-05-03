'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

export const SEX = Object.createMap({
	unknown: 0,
	male: 1,
	female: 2
});

export const LANG = Object.createMap({
	ru: 0,
	en: 1
});

export const RELATION = Object.createMap({
	you: -1,
	unknown: 0,
	friend: 1,
	confirm: 2,
	awaiting: 3
});
