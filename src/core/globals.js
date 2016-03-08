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
	 * @param name - module name
	 * @param dependencies - module dependencies
	 */
	add(name: string, dependencies: Array<string>) {
		if (!this.cache[name]) {
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

		this.cache[name] = dependencies;
		this.event.emit(`dependencies.${name}`, {dependencies, name});
	},

	/**
	 * Get dependencies for the specified module
	 * @param name - module name
	 */
	get(name: string): Promise<Array<string>> {
		if (this.cache[name]) {
			return this.cache[name];
		}

		const script = document.createElement('script');
		script.src = `${BASE}${name}.dependencies.js`;

		return new Promise((resolve) => {
			this.event.once(`dependencies.${name}`, resolve);
			document.head.appendChild(script);
		});
	}
};
