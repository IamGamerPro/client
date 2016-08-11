'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import { status } from '../../i-base/i-base';
import { initEvent, props } from '../../../core/block';

export const
	binds = {},
	watchers = {},
	locals = {},
	blockProps = {},
	mixins = {};

/**
 * Sets the specified parameters to a Vue property
 *
 * @decorator
 * @param params - property parameters
 */
export function params(params) {
	return (target, key, desc) => {
		initEvent.once('block', (block) => {
			const
				a = desc.get || desc.set;

			if (a) {
				Object.assign(a, params);
				return;
			}

			if (key.slice(0, 2) === '$$' && desc.value) {
				Object.assign(desc.value, params);
				return;
			}

			Object.assign(props[block][key], params);
		});
	};
}

/**
 * Sets a Vue property as abstract
 * @decorator
 */
export const abstract = params({abstract: true});

/**
 * Sets a Vue property as data
 *
 * @decorator
 * @param [initializer] - initializer function
 */
export function field(initializer?: (o: iBlock) => any | any) {
	return params({data: true, initializer});
}

/**
 * Defines a property as block
 *
 * @decorator
 * @param [name] - property name
 * @param [keyName] - key name
 */
export function blockProp(name?: string, keyName?: string) {
	return (target, key) => {
		initEvent.once('block', (block) => {
			blockProps[block] = blockProps[block] || [];
			blockProps[block].push([name || key, keyName || key]);
		});
	};
}

/**
 * Binds a modifier to the specified parameter
 *
 * @decorator
 * @param param
 * @param [fn] - converter function
 * @param [opts] - additional options
 */
export function bindToParam(param: string, fn?: Function = Boolean, opts?: Object) {
	return (target, key) => {
		initEvent.once('block', (block) => {
			binds[block] = (binds[block] || []).concat(function () {
				this.bindModToParam(key, param, fn, opts);
			});
		});
	};
}

/**
 * Marks a static property as mixin
 * @decorator
 */
export function mixin(target, key, desc) {
	initEvent.once('block', (block) => {
		mixins[block] = mixins[block] || {};
		mixins[block][key] = desc.initializer ? desc.initializer() : desc.value;
	});
}

/**
 * Adds watcher for the specified property
 *
 * @decorator
 * @param handler
 * @param [params] - additional parameters for $watch
 */
export function watch(handler: (value: any, oldValue: any) => void | string, params?: Object) {
	return (target, key) => {
		initEvent.once('block', (block) => {
			watchers[block] = (watchers[block] || []).concat(function () {
				this.$watch(key, Object.isFunction(handler) ? handler : this[handler], params);
			});
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
	return (target, key, descriptor) => {
		initEvent.once('block', (block) => {
			locals[block] = (locals[block] || []).concat(function () {
				this.local[method](`block.mod.set.${name}.${value}`, descriptor.value.bind(this));
			});
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
	return (target, key, descriptor) => {
		initEvent.once('block', (block) => {
			locals[block] = (locals[block] || []).concat(function () {
				this.local[method](`block.mod.remove.${name}.${value}`, descriptor.value.bind(this));
			});
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
	return (target, key, descriptor) => {
		initEvent.once('block', (block) => {
			locals[block] = (locals[block] || []).concat(function () {
				this.local[method](`el.mod.set.${elName}.${modName}.${value}`, descriptor.value.bind(this));
			});
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
	return (target, key, descriptor) => {
		initEvent.once('block', (block) => {
			locals[block] = (locals[block] || []).concat(function () {
				this.local[method](`el.mod.remove.${elName}.${modName}.${value}`, descriptor.value.bind(this));
			});
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
	return (target, key, descriptor) => {
		initEvent.once('block', (block) => {
			locals[block] = (locals[block] || []).concat(function () {
				this.local[method](`block.state.${state}`, descriptor.value.bind(this));
			});
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

	/** @this {iBlock} */
	function wrapper() {
		const
			event = () => this.local.once(`block.state.${status[state]}`, () => handler.call(this, ...arguments));

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
		return wrapper.call(this);
	}

	return (target, key, descriptors) => {
		handler = descriptors.value;
		descriptors.value = wrapper;
	};
}
