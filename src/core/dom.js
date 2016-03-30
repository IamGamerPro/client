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
 * @param [handler]
 */
export function delegate(selector: string, handler?: Function): Function {
	function wrapper(e) {
		const
			link = e.target.currentOrClosest(selector);

		if (link) {
			e.delegateTarget = link;
			handler.call(this, e);
		}
	}

	if (handler) {
		return wrapper;
	}

	return (target, key, descriptors) => {
		handler = descriptors.value;
		descriptors.value = wrapper;
	};
}

/**
 * Returns the current element if it matches by the specified selector or the closest ancestor
 * @param selector
 */
Element.prototype.currentOrClosest = function (selector: string): ?Element {
	return this.matches(selector) ? this : this.closest(selector);
};

/**
 * Returns a position of the element relative to the document
 */
Element.prototype.getPosition = function (): {top: number, left: number} {
	const box = this.getBoundingClientRect();
	return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	};
};
