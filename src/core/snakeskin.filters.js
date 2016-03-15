'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import ss from 'snakeskin';

ss.importFilters({
	/** @override */
	bem(block: string, node: Element, val: string): string {
		return [block + val, '{{blockId}}'].join(' ');
	}
});
