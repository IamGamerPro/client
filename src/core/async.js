'use strict';

// jscs:disable validateAlignedFunctionParameters

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';

/**
 * Base class for Async IO
 *
 * @example
 * this.setImmediate(() => alert(1));                                    // 1
 * this.setImmediate({fn: () => alert(2), label: 'foo'});                // -
 * this.setImmediate({fn: () => alert(3), label: 'foo'});                // 3, calls only last task with a same label
 * this.setImmediate({fn: () => alert(4), group: 'bar'});                // 4
 * this.setImmediate({fn: () => alert(5), label: 'foo', group: 'bar'});  // -
 * this.setImmediate({fn: () => alert(6), label: 'foo', group: 'bar'});  // 6
 */
export default class Async {

	/**
	 * Cache object for async operations
	 */
	cache: ?Object;

	constructor() {
		this.cache = {};
	}

	/**
	 * Returns the specified value if it is an event object
	 * @param value
	 */
	static getIfEvent(value: any): ?Function {
		return Object.isObject(value) && Object.isString(value.event) && value.element instanceof Node ? value : undefined;
	}

	/**
	 * Returns the specified value if it is a function
	 * @param value
	 */
	static getIfFunction(value: any): ?Function {
		return Object.isFunction(value) ? value : undefined;
	}

	/**
	 * Returns the specified value if it is a worker
	 * @param value
	 */
	static getIfWorker(value: any): ?Worker {
		return value instanceof Worker ? value : undefined;
	}

	/**
	 * Terminates the specified worker
	 * @param worker
	 */
	static clearWorker(worker: Worker) {
		worker.terminate();
	}

	/**
	 * Returns the specified value if it is a promise
	 * @param value
	 */
	static getIfPromise(value: any): ?Promise {
		return value instanceof Promise ? value : undefined;
	}

	/**
	 * Terminates the specified request
	 * @param request
	 */
	static clearRequest(request: XMLHttpRequest) {
		request.abort();
	}

	/**
	 * Wrapper for setImmediate
	 */
	setImmediate(
		{fn, label, group, onClear}: {fn: Function, label?: string, group?: string, onClear?: Function} | Function,
		...args: any

	): number {
		return this._set({
			name: 'immediate',
			obj: fn || Async.getIfFunction(arguments[0]),
			clearFn: clearImmediate,
			wrapper: setImmediate,
			linkByWrapper: true,
			onClear,
			args,
			label,
			group
		});
	}

	/**
	 * Wrapper for clearImmediate
	 */
	clearImmediate({id, label, group}: {id: number, label?: string, group?: string} | number): Async {
		return this._clear({
			name: 'immediate',
			clearFn: clearImmediate,
			id: id || Async.getIfFunction(arguments[0]),
			label,
			group
		});
	}

	/**
	 * Clears all setImmediate tasks
	 */
	clearAllImmediates(): Async {
		return this._clearAll({
			name: 'immediate',
			clearFn: clearImmediate
		});
	}

	/**
	 * Wrapper for setInterval
	 */
	setInterval(
		{fn, label, group, onClear}: {fn: Function, label?: string, group?: string, onClear?: Function} | Function,
		interval: number,
		...args: any

	): number {
		return this._set({
			name: 'interval',
			obj: fn || Async.getIfFunction(arguments[0]),
			clearFn: clearInterval,
			wrapper: setInterval,
			linkByWrapper: true,
			interval: true,
			args: arguments[1],
			onClear,
			label,
			group
		});
	}

	/**
	 * Wrapper for clearInterval
	 */
	clearInterval({id, label, group}: {id: number, label?: string, group?: string} | number): Async {
		return this._clear({
			name: 'interval',
			clearFn: clearInterval,
			id: id || Async.getIfFunction(arguments[0]),
			label,
			group
		});
	}

	/**
	 * Clears all setInterval tasks
	 */
	clearAllIntervals(): Async {
		return this._clearAll({
			name: 'interval',
			clearFn: clearInterval
		});
	}

	/**
	 * Wrapper for setTimeout
	 */
	setTimeout(
		{fn, label, group, onClear}: {fn: Function, label?: string, group?: string, onClear?: Function} | Function,
		timer: number,
		...args: any

	): number {
		return this._set({
			name: 'timeout',
			obj: fn || Async.getIfFunction(arguments[0]),
			clearFn: clearTimeout,
			wrapper: setTimeout,
			linkByWrapper: true,
			args: arguments[1],
			onClear,
			label,
			group
		});
	}

	/**
	 * Wrapper for clearTimeout
	 */
	clearTimeout({id, label, group}: {id: number, label?: string, group?: string} | number): Async {
		return this._clear({
			name: 'timeout',
			clearFn: clearTimeout,
			id: id || Async.getIfFunction(arguments[0]),
			label,
			group
		});
	}

	/**
	 * Clears all setTimeout tasks
	 */
	clearAllTimeouts(): Async {
		return this._clearAll({
			name: 'timeout',
			clearFn: clearTimeout
		});
	}

	/**
	 * Proxy for a Worker instance
	 */
	setWorker(
		{worker, label, group, onClear}: {worker: Worker, label?: string, group?: string, onClear?: Function} | Function

	): number {
		return this._set({
			name: 'worker',
			obj: worker || Async.getIfWorker(arguments[0]),
			clearFn: Async.clearWorker,
			interval: true,
			onClear,
			label,
			group
		});
	}

	/**
	 * Terminates the specified worker
	 */
	clearWorker({id, label, group}: {id: Worker, label?: string, group?: string} | Worker): Async {
		return this._clear({
			name: 'worker',
			clearFn: Async.clearWorker,
			id: id || Async.getIfWorker(arguments[0]),
			label,
			group
		});
	}

	/**
	 * Terminates all register workers
	 */
	clearAllWorkers(): Async {
		return this._clearAll({
			name: 'worker',
			clearFn: Async.clearWorker
		});
	}

	/**
	 * Proxy for a request
	 */
	setRequest(
		{req, label, group, onClear}: {req: Promise, label?: string, group?: string, onClear?: Function} | Function

	): number {
		return this._set({
			name: 'request',
			obj: req || Async.getIfPromise(arguments[0]),
			clearFn: Async.clearRequest,
			interval: true,
			onClear,
			label,
			group
		});
	}

	/**
	 * Terminates the specified request
	 */
	clearRequest({id, label, group}: {id: Promise, label?: string, group?: string} | Worker): Async {
		return this._clear({
			name: 'request',
			clearFn: Async.clearRequest,
			id: id || Async.getIfPromise(arguments[0]),
			label,
			group
		});
	}

	/**
	 * Terminates all register requests
	 */
	clearAllRequests(): Async {
		return this._clearAll({
			name: 'request',
			clearFn: Async.clearRequest
		});
	}

	/**
	 * Proxy for some callback function
	 */
	setProxy(
		{fn, single = true, label, group, onClear}:
			{fn: Function, interval: ?boolean, label?: string, group?: string, onClear?: Function} | Function

	): Function {
		return this._set({
			name: 'proxy',
			obj: fn || Async.getIfFunction(arguments[0]),
			wrapper: (fn) => fn,
			linkByWrapper: true,
			interval: !single,
			onClear,
			label,
			group
		});
	}

	/**
	 * Cancels the specified function
	 */
	clearProxy({id, label, group}: {id: Function, label?: string, group?: string} | Function): Async {
		return this._clear({
			name: 'proxy',
			id: id || Async.getIfFunction(arguments[0]),
			label,
			group
		});
	}

	/**
	 * Cancels all register functions
	 */
	clearAllProxies(): Async {
		return this._clearAll({name: 'proxy'});
	}

	/**
	 * Wrapper for Node.addEventListener
	 */
	addNodeEventListener(
		element: Node,
		event: string,
		{fn, label, group, onClear}: {fn: Function, label?: string, group?: string, onClear?: Function} | Function,
		useCapture?: boolean = false

	): Object {
		const
			events = event.split(/\s+/),
			links = [];

		for (let event of events) {
			const
				handler = fn || Async.getIfFunction(arguments[2]);

			links.push(this._set({
				name: 'eventListener',
				obj: handler,
				clearFn({event, element, handler, useCapture}) {
					element.removeEventListener(event, handler, useCapture);
				},

				wrapper() {
					element.addEventListener(event, handler, useCapture);
					return {event, element, handler, useCapture};
				},

				linkByWrapper: true,
				interval: true,
				onClear,
				label,
				group
			}));
		}

		return events.length === 1 ? links[0] : links;
	}

	/**
	 * Wrapper for Node.removeEventListener
	 */
	removeNodeEventListener({id, label, group}: {id: number, label?: string, group?: string} | number): Async {
		return this._clear({
			name: 'eventListener',
			clearFn({event, element, handler, useCapture}) {
				element.removeEventListener(event, handler, useCapture);
			},

			id: id || Async.getIfEvent(arguments[0]),
			label,
			group
		});
	}

	/**
	 * Clears all addNodeEventListener tasks
	 */
	removeAllNodeEventListeners(): Async {
		return this._clearAll({
			name: 'eventListener',
			clearFn({event, element, handler, useCapture}) {
				element.removeEventListener(event, handler, useCapture);
			}
		});
	}

	/**
	 * Clears all async operations
	 */
	clearAll({group, label} = {}): Async {
		if (group || label) {
			const
				[q] = arguments;

			this
				.removeNodeEventListener(q);

			this
				.clearImmediate(q)
				.clearInterval(q)
				.clearTimeout(q);

			this
				.clearRequest(q)
				.clearWorker(q)
				.clearProxy(q);

		} else {
			this
				.removeAllNodeEventListeners();

			this
				.clearAllImmediates()
				.clearAllIntervals()
				.clearAllTimeouts();

			this
				.clearAllRequests()
				.clearAllWorkers()
				.clearAllProxies();
		}

		return this;
	}

	_initCache(name: string): Object {
		return this.cache[name] = this.cache[name] || {
			root: {
				labels: {},
				links: new Map()
			},

			groups: {}
		};
	}

	_set({name, obj, clearFn, onClear, wrapper, linkByWrapper, args, interval, label, group}) {
		let cache = this._initCache(name);

		if (group) {
			cache.groups[group] = cache.groups[group] || {
				labels: {},
				links: new Map()
			};

			cache = cache.groups[group];

		} else {
			cache = cache.root;
		}

		const
			{labels, links} = cache;

		if (labels[label]) {
			this._clear({name, clearFn, label, group});
		}

		let
			id,
			fnLink = id = obj;

		if (!interval) {
			fnLink = function () {
				links.delete(id);
				delete labels[label];
				Object.isFunction(obj) && obj.call(this, ...arguments);
			};
		}

		if (wrapper) {
			let link = wrapper(fnLink, ...[].concat(args));
			if (linkByWrapper) {
				id = link;
			}
		}

		links.set(id, {
			id,
			fnLink,
			label,
			onClear
		});

		if (label) {
			labels[label] = id;
		}

		return id;
	}

	_clear({name, clearFn, id, label, group}) {
		let cache = this._initCache(name);

		if (group) {
			if (!cache.groups[group]) {
				return this;
			}

			cache = cache.groups[group];

		} else {
			cache = cache.root;
		}

		const
			{labels, links} = cache;

		if (label) {
			const
				tmp = labels[label];

			if (id != null && id !== tmp) {
				return this;
			}

			id = tmp;
		}

		if (id != null) {
			const
				val = links.get(id);

			if (val) {
				links.delete(val.id);
				delete labels[val.label];

				if (val.onClear) {
					val.onClear(val.id);
				}

				if (clearFn) {
					clearFn(val.id);
				}
			}

		} else {
			$C(links).forEach(({id}) =>
				this._clear({name, clearFn, id, group}));
		}

		return this;
	}

	_clearAll({name, clearFn}) {
		this._clear(...arguments);

		$C(this._initCache(name).groups).forEach((el, group) =>
			this._clear({name, clearFn, group}));

		return this;
	}
}
