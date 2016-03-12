'use strict';

// jscs:disable validateOrderInObjectKeys

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

module.exports = {
	watch: true,
	externals: {
		'collection.js': '$C',
		'eventemitter2': 'EventEmitter2',
		'js-keycodes': 'KeyCodes',
		'localforage': 'localforage',
		'snakeskin': 'Snakeskin',
		'validator': 'validator',
		'vue': 'Vue',
		'uri': 'URI',
		'page': 'page'
	}
};
