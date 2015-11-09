/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';

export default class Async {
	cache: ?Object;

	constructor() {
		this.cache = {};
	}

	static clearWorker(worker: Worker) {
		worker.terminate();
	}

	static getIfFunction(val: any): ?Function {
		return Object.isFunction(val) ? val : undefined;
	}

	static getIfWorker(val): ?Worker {
		return val instanceof Worker ? val : undefined;
	}

	setImmediate(
		{fn, label, group}: {fn: Function, label: ?string, group: ?string} | Function,
		...args: any

	): number {
		return this._set({
			name: 'immediate',
			obj: fn || Async.getIfFunction(arguments[0]),
			clearFn: clearImmediate,
			wrapper: setImmediate,
			linkByWrapper: true,
			args: args,
			label,
			group
		});
	}

	clearImmediate({id, label, group}: {id: number, label: ?string, group: ?string} | number): Async {
		return this._clear({
			name: 'immediate',
			clearFn: clearImmediate,
			id: id || Async.getIfFunction(arguments[0]),
			label,
			group
		});
	}

	clearAllImmediates(): Async {
		return this._clearAll({
			name: 'immediate',
			clearFn: clearImmediate
		});
	}

	setInterval(
		{fn, label, group}: {fn: Function, label: ?string, group: ?string} | Function,
		[interval, ...args]: [number, any]

	): number {
		return this._set({
			name: 'interval',
			obj: fn || Async.getIfFunction(arguments[0]),
			clearFn: clearInterval,
			wrapper: setInterval,
			linkByWrapper: true,
			interval: true,
			args: arguments[1],
			label,
			group
		});
	}

	clearInterval({id, label, group}: {id: number, label: ?string, group: ?string} | number): Async {
		return this._clear({
			name: 'interval',
			clearFn: clearInterval,
			id: id || Async.getIfFunction(arguments[0]),
			label,
			group
		});
	}

	clearAllIntervals(): Async {
		return this._clearAll({
			name: 'interval',
			clearFn: clearInterval
		});
	}

	setTimeout(
		{fn, label, group}: {fn: Function, label: ?string, group: ?string} | Function,
		[timer, ...args]: [number, any]

	): number {
		return this._set({
			name: 'timeout',
			obj: fn || Async.getIfFunction(arguments[0]),
			clearFn: clearTimeout,
			wrapper: setTimeout,
			linkByWrapper: true,
			args: arguments[1],
			label,
			group
		});
	}

	clearTimeout({id, label, group}: {id: number, label: ?string, group: ?string} | number): Async {
		return this._clear({
			name: 'timeout',
			clearFn: clearTimeout,
			id: id || Async.getIfFunction(arguments[0]),
			label,
			group
		});
	}

	clearAllTimeouts(): Async {
		return this._clearAll({
			name: 'timeout',
			clearFn: clearTimeout
		});
	}

	setWorker({worker, label, group}: {worker: Worker, label: ?string, group: ?string} | Function): number {
		return this._set({
			name: 'worker',
			obj: worker || Async.getIfWorker(arguments[0]),
			clearFn: Async.clearWorker,
			interval: true,
			label,
			group
		});
	}

	clearWorker({id, label, group}: {id: Worker, label: ?string, group: ?string} | Worker): Async {
		return this._clear({
			name: 'worker',
			clearFn: Async.clearWorker,
			id: id || Async.getIfWorker(arguments[0]),
			label,
			group
		});
	}

	clearAllWorkers(): Async {
		return this._clearAll({
			name: 'worker',
			clearFn: Async.clearWorker
		});
	}

	cb(
		{fn, interval, label, group}: {fn: Function, interval: ?boolean, label: ?string, group: ?string} | Function

	): Function {
		return this._set({
			name: 'cb',
			obj: fn || Async.getIfFunction(arguments[0]),
			interval,
			label,
			group
		});
	}

	clearCb({id, label, group}: {id: Function, label: ?string, group: ?string} | Function): Async {
		return this._clear({
			name: 'cb',
			id: id || Async.getIfFunction(arguments[0]),
			label,
			group
		});
	}

	clearAllCbs(): Async {
		return this._clearAll({name: 'async'});
	}

	clearAll(): Async {
		this
			.clearAllImmediates()
			.clearAllIntervals()
			.clearAllTimeouts();

		this
			.clearAllWorkers()
			.clearAllCbs();

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

	_set({name, obj, clearFn, wrapper, linkByWrapper, args, interval, label, group}) {
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
			label
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
				clearFn && clearFn(val.id);
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
