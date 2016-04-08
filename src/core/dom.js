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
			link = e.target.closest(selector);

		if (link) {
			e.delegateTarget = link;
			handler.call(this, e);

		} else {
			return false;
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
 * Returns a position of the element relative to the document
 */
Element.prototype.getPosition = function (): {top: number, left: number} {
	const box = this.getBoundingClientRect();
	return {
		top: box.top + pageYOffset,
		left: box.left + pageXOffset
	};
};

/**
 * Returns a position of the element relative to the parent
 * @param [parent]
 */
Node.prototype.getOffset = function (parent?: Element | string): {top: number, left: number} {
	const res = {
		top: this.offsetTop,
		left: this.offsetLeft
	};

	if (!parent) {
		return res;
	}

	let
		{offsetParent} = this;

	function matcher() {
		return offsetParent && offsetParent !== document.documentElement &&
			(Object.isString(parent) ? !offsetParent.matches(parent) : offsetParent !== parent);
	}

	while (matcher()) {
		res.top += offsetParent.offsetTop;
		res.left += offsetParent.offsetLeft;
		({offsetParent} = offsetParent);
	}

	return res;
};
