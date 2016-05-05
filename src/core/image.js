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
	if (this.comlete) {
		cb.call(this);

	} else {
		const img = new Image();
		img.onload = cb;
		img.src = this.src;
	}
};

/**
 * Promisify version of HTMLImageElement.onInit
 */
Object.defineProperty(HTMLImageElement.prototype, 'init', {
	get(): Promise<HTMLImageElement> {
		return new Promise((resolve) => this.onInit(() => resolve(this)));
	}
});
