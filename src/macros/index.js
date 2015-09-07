/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

/**
 * Defines a module
 *
 * @param {string} name - module name
 * @return {{extends: function(string): {dependencies: function(...string)}, dependencies: function(...string)}}
 */
global.package = function (name) {
	function dependencies(...name) {}

	return {
		extends(name) {
			return {dependencies};
		},

		dependencies
	};
};
