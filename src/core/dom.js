'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $ from 'sprint';

/**
 * Delegates the specified event
 *
 * @decorator
 * @param selector - selector for delegating the element
 * @param [fn] - event handler
 */
export function delegate(selector: string, fn?: Function): Function {
	function wrapper(e) {
		const
			link = e.target.matches(selector) ? e.target : $(e.target).closest(selector).get(0);

		if (link) {
			e.delegateTarget = link;
			fn.call(this, e);
		}
	}

	if (fn) {
		return wrapper;
	}

	return function (target, key, descriptors) {
		fn = descriptors.value;
		descriptors.value = wrapper;
	};
}
