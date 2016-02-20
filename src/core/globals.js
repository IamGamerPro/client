'use strict';

// jscs:disable validateOrderInObjectKeys

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
	cache: {},
	event: new EventEmitter2({wildcard: true}),

	/**
	 * Adds new dependencies to the cache
	 *
	 * @param moduleName
	 * @param dependencies
	 */
	add(moduleName: string, dependencies: Array<string>) {
		this.cache[moduleName] = dependencies;
		this.event.emit(moduleName, dependencies);
	},

	/**
	 * Get dependencies for the specified module
	 * @param moduleName
	 */
	get(moduleName: string): Promise<Array<string>> {
		if (this.cache[moduleName]) {
			return this.cache[moduleName];
		}

		const script = document.createElement('script');
		script.src = `${moduleName}.dependencies.js`;

		return new Promise((resolve) => {
			this.event.once(moduleName, resolve);
			document.head.appendChild(script);
		});
	}
};
