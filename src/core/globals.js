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
 * @param str
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
		let packages = 0;

		function indicator() {
			const blob = new Blob(
				[`ModuleDependencies.event.emit('component.${moduleName}.loading', {packages: ${packages}})`],
				{type: 'application/javascript'
			});

			const script = document.createElement('script');
			script.src = URL.createObjectURL(blob);
			script.async = false;

			document.head.appendChild(script);
		}

		const
			queue = [];

		if (!this.cache[moduleName]) {
			$C(dependencies).forEach((el) => {
				if (this.cache[el]) {
					return;
				}

				packages += 2;
				const script = document.createElement('script');
				script.src = `${BASE}${el}.js`;
				script.async = false;

				const link = document.createElement('link');
				link.href = `${BASE}${el}.css`;
				link.rel = `prefetch stylesheet`;

				queue.push(() => {
					document.head.appendChild(link);
					indicator();
					document.head.appendChild(script);
					indicator();
				});
			});

			$C(queue).forEach((fn) => fn());
		}

		this.cache[moduleName] = dependencies;
		this.event.emit(`dependencies.${moduleName}`, {dependencies, moduleName, packages});
	},

	/**
	 * Get dependencies for the specified module
	 * @param module
	 */
	get(module: string): Promise<Array<string>> {
		if (this.cache[module]) {
			return this.cache[module];
		}

		const script = document.createElement('script');
		script.src = `${BASE}${module}.dependencies.js`;

		return new Promise((resolve) => {
			this.event.once(`dependencies.${module}`, resolve);
			document.head.appendChild(script);
		});
	}
};
