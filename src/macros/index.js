'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

type D = (...name: string) => void;

/**
 * Defines a module
 * @param name - module name
 */
global.package = function (name: string): {extends(name: string): {dependencies: D}, dependencies: D} {
	function dependencies(...name) {}

	return {
		dependencies,
		extends(name) {
			return {dependencies};
		}
	};
};
