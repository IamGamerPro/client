'use strict';

// jscs:disable validateOrderInObjectKeys

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import EventEmitter2 from 'eventemitter2';
import { GLOBAL } from './const/links';

/**
 * Path to the base folder
 */
GLOBAL.BASE = '';

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
		if (!this.cache[moduleName]) {
			$C(dependencies).forEach((el) => {
				if (!this.cache[el]) {
					const script = document.createElement('script');
					script.src = `${BASE}${el}.js`;

					const link = document.createElement('link');
					link.href = `${BASE}${el}.css`;
					link.rel = `stylesheet`;

					document.head.appendChild(link);
					document.head.appendChild(script);
				}
			});
		}

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
		script.src = `${BASE}${moduleName}.dependencies.js`;

		return new Promise((resolve) => {
			this.event.once(moduleName, resolve);
			document.head.appendChild(script);
		});
	}
};
