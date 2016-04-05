'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

/**
 * Executes the specified function after the source image load
 * @param {function()} cb
 */
HTMLImageElement.prototype.onInit = function (cb: () => void) {
	if (!this.complete) {
		this.onload = cb;

	} else {
		cb.call(this);
	}
};
