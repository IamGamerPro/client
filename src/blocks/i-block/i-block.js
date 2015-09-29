/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBase from '../i-base/i-base';

export default class iBlock extends iBase {
	/**
	 * Page model
	 * @type {Vue}
	 */
	model = null;

	/**
	 * Page data
	 * @type {Object}
	 */
	data = null;

	/** @override */
	constructor({model, data} = {}) {
		super(...arguments);
		this.model = model;
		this.data = data;
	}
}
