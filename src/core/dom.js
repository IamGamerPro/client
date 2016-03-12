'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

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
			link = e.target.matches(selector) ? e.target : e.target.closest(selector);

		if (link) {
			e.delegateTarget = link;
			fn.call(this, e);
		}
	}

	if (fn) {
		return wrapper;
	}

	return (target, key, descriptors) => {
		fn = descriptors.value;
		descriptors.value = wrapper;
	};
}
