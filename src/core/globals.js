'use strict';

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
		let packages = 0;

		function indicator() {
			const blob = new Blob(
				[`ModuleDependencies.event.emit('component.${name}.loading', {packages: ${packages}})`],
				{type: 'application/javascript'
			});

			const script = document.createElement('script');
			script.src = URL.createObjectURL(blob);
			document.head.appendChild(script);
		}

		const
			queue = [];

		if (!this.cache[name]) {
			$C(dependencies).forEach((el) => {
				if (!this.cache[el]) {
					packages += 2;

					const script = document.createElement('script');
					script.src = `${BASE}${el}.js`;

					const link = document.createElement('link');
					link.href = `${BASE}${el}.css`;
					link.rel = `stylesheet`;

					queue.push(() => {
						document.head.appendChild(link);
						indicator();
						document.head.appendChild(script);
						indicator();
					});
				}
			});

			$C(queue).forEach((fn) => fn());
		}

		this.cache[name] = dependencies;
		this.event.emit(`dependencies.${name}`, {dependencies, name, packages});
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
