'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import keyCodes from '../../../core/keyCodes';

const
	Vue = require('vue'),
	uuid = require('uuid');

const
	cache = new WeakMap();

function bind(node, p, vNode, oldVNode) {
	const
		m = p.modifiers || {},
		obj = vNode.context.async;

	const
		isObj = Object.isObject(p.value),
		group = isObj && p.value.group || uuid.v4(),
		handler = isObj ? p.value.fn : p.value;

	if (oldVNode && cache.has(oldVNode)) {
		$C(cache.get(oldVNode)).forEach((group) => obj.removeNodeEventListener({group}));
	}

	cache.set(
		vNode,
		[].concat(cache.get(vNode) || [], group)
	);

	if (p.arg === 'dnd') {
		obj.dnd(node, Object.assign({group}, p.value));

	} else {
		obj.addNodeEventListener(
			node,
			p.arg.replace(/,/g, ' '),
			Object.assign({group}, isObj ? p.value : undefined, {fn}),
			Boolean(m.capture)
		);
	}

	function fn(e) {
		if (
			p.alt && !e.altKey ||
			p.shift && !e.shiftKey ||
			p.ctrl && !e.ctrlKey ||
			p.meta && !e.metaKey ||
			p.key && keyCodes.getKeyNameFromKeyCode(e.keyCode).toLowerCase() !== p.key.split(':')[1]

		) {
			return;
		}

		if (m.prevent) {
			e.preventDefault();
		}

		if (m.stop) {
			e.stopPropagation();
		}

		if (m.stopImmediate) {
			e.stopImmediatePropagation();
		}

		handler && handler.call(this, ...arguments);
	}
}

Vue.directive('e', {
	bind,
	update: bind
});
