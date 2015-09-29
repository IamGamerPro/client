/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBase from '../i-base/i-base';
import Vue from 'vue';

export default class iPage extends iBase {
	/**
	 * Page model
	 * @type {Vue}
	 */
	model = null;

	/** @override */
	constructor({data}) {
		super(...arguments);
		this.model = new Vue({
			el: this.node,
			data
		});
	}
}
