'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { lastBlock, status } from '../../../core/block';

export const
	binds = {},
	handlers = {},
	events = {};

/**
 * Binds a modifier to the specified parameter
 *
 * @decorator
 * @param param
 * @param [fn] - converter function
 * @param [opts] - additional options
 */
export function bindToParam(param: string, fn?: Function = Boolean, opts?: Object) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @bindToParam decorator. Need to use @block.');
	}

	return (target, key) => {
		binds[lastBlock] = (binds[lastBlock] || []).concat(function () {
			this.bindModToParam(key, param, fn, opts);
		});
	};
}

export const
	props = {};

/**
 * Sets @option as mixin
 * @decorator
 */
export function mixin(target, key) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @mixin decorator. Need to use @block.');
	}

	props[lastBlock] = (props[lastBlock] || []).concat(key);
}

/**
 * Adds watcher for the specified property
 *
 * @decorator
 * @param handler
 * @param [params] - additional parameters for $watch
 */
export function $watch(handler: (val: any, oldVal: any) => void | string, params?: Object) {
	if (!lastBlock) {
		throw new Error('Invalid usage of @watch decorator. Need to use @block.');
	}

	return (target, key) => {
		handlers[lastBlock] = (handlers[lastBlock] || []).concat(function () {
			this.$watch(key, Object.isFunction(handler) ? handler : this[handler], params);
		});
	};
}

/**
 * Decorates a method as a modifier handler
 *
 * @decorator
 * @param name
 * @param [value]
 * @param [method]
 */
export function mod(name: string, value?: any = '*', method?: string = 'on') {
	if (!lastBlock) {
		throw new Error('Invalid usage of @mod decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`block.mod.set.${name}.${value}`, descriptor.value.bind(this));
		});
	};
}

/**
 * Decorates a method as a remove modifier handler
 *
 * @decorator
 * @param name
 * @param [value]
 * @param [method]
 */
export function removeMod(name: string, value?: any = '*', method?: string = 'on') {
	if (!lastBlock) {
		throw new Error('Invalid usage of @removeMod decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`block.mod.remove.${name}.${value}`, descriptor.value.bind(this));
		});
	};
}

/**
 * Decorates a method as an element modifier handler
 *
 * @decorator
 * @param elName
 * @param modName
 * @param [value]
 * @param [method]
 */
export function elMod(elName: string, modName: string, value?: any = '*', method?: string = 'on') {
	if (!lastBlock) {
		throw new Error('Invalid usage of @elMod decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`el.mod.set.${elName}.${modName}.${value}`, descriptor.value.bind(this));
		});
	};
}

/**
 * Decorates a method as an element remove modifier handler
 *
 * @decorator
 * @param elName
 * @param modName
 * @param [value]
 * @param [method]
 */
export function removeElMod(elName: string, modName: string, value?: any = '*', method?: string = 'on') {
	if (!lastBlock) {
		throw new Error('Invalid usage of @removeElMod decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`el.mod.remove.${elName}.${modName}.${value}`, descriptor.value.bind(this));
		});
	};
}

/**
 * Decorates a method as a state handler
 *
 * @decorator
 * @param state
 * @param [method]
 */
export function state(state: number, method?: string = 'on') {
	if (!lastBlock) {
		throw new Error('Invalid usage of @state decorator. Need to use @block.');
	}

	return (target, key, descriptor) => {
		events[lastBlock] = (events[lastBlock] || []).concat(function () {
			this.event[method](`block.state.${state}`, descriptor.value.bind(this));
		});
	};
}

/**
 * Decorates a method or a function for using with the specified state
 *
 * @decorator
 * @param state
 * @param handler
 */
export function wait(state: number | string, handler?: Function) {
	if (Object.isString(state)) {
		state = status[state];
	}

	function wrapper() {
		const
			event = () => this.event.once(`block.state.${status[state]}`, () => handler.call(this, ...arguments));

		if (this.block) {
			if (this.block.state >= state) {
				return handler.call(this, ...arguments);
			}

			event();

		} else {
			event();
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
