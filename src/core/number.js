'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

Object.defineProperties(Number.prototype, {
	em: {
		get(): string {
			return `${this}em`;
		}
	},

	ex: {
		get(): string {
			return `${this}ex`;
		}
	},

	px: {
		get(): string {
			return `${this}px`;
		}
	},

	rem: {
		get(): string {
			return `${this}rem`;
		}
	}
});
