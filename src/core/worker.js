'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

export class RawWorker {
	constructor(text: string): Worker {
		return new Worker(URL.createObjectURL(new Blob([text])));
	}
}
