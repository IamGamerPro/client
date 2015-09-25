/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import ss from 'snakeskin';

ss.importFilters({
	bem(block, val) {
		return [block + val, this.id].join(' ');
	}
});
