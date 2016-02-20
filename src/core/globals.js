'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { GLOBAL } from './const/links';
import EventEmitter2 from 'eventemitter2';

/**
 * Global i18n function
 * @param str - source string
 */
GLOBAL.i18n = function (str: string): string {
	return str;
};

GLOBAL.ModuleDependencies = {
	/**
	 * Adds new dependencies to the cache
	 *
	 * @param key
	 * @param dependencies
	 */
	add(key: string, dependencies: Array<string>) {
		this.cache[key] = dependencies;
		this.event.emit(key, dependencies);
	},

	cache: {},
	event: new EventEmitter2({wildcard: true})
};
