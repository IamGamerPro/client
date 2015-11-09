/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';

export class Async {
	cache: ?Object;

	constructor() {
		this.cache = {};
	}

	setImmediate(
		{fn, label, group}: {fn: Function, label: ?string, group: ?string} | Function,
		...args: any

	): number {
		return this._set({
			name: 'immediate',
			fn: fn || this._getIfFunction(arguments[0]),
			clearFn: clearImmediate,
			wrapper: setImmediate,
			linkByWrapper: true,
			args: args,
			label,
			group
		});
	}

	clearImmediate({id, label, group}: {id: any, label: ?string, group: ?string} | Function): Async {
		return this._clear({
			name: 'immediate',
			clearFn: clearImmediate,
			id: id || this._getIfFunction(arguments[0]),
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
			fn: fn || this._getIfFunction(arguments[0]),
			clearFn: clearInterval,
			wrapper: setInterval,
			linkByWrapper: true,
			interval: true,
			args: arguments[1],
			label,
			group
		});
	}

	clearInterval({id, label, group}: {id: any, label: ?string, group: ?string} | Function): Async {
		return this._clear({
			name: 'interval',
			clearFn: clearInterval,
			id: id || this._getIfFunction(arguments[0]),
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
			fn: fn || this._getIfFunction(arguments[0]),
			clearFn: clearTimeout,
			wrapper: setTimeout,
			linkByWrapper: true,
			args: arguments[1],
			label,
			group
		});
	}

	clearTimeout({id, label, group}: {id: any, label: ?string, group: ?string} | Function): Async {
		return this._clear({
			name: 'timeout',
			clearFn: clearTimeout,
			id: id || this._getIfFunction(arguments[0]),
			label,
			group
		});
	}

	clearAllTimeout(): Async {
		return this._clearAll({
			name: 'timeout',
			clearFn: clearTimeout
		});
	}

	_getIfFunction(val) {
		return Object.isFunction(val) ? val : undefined;
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

	_set({name, fn, clearFn, wrapper, linkByWrapper, args, interval, label, group}) {
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
			fnLink = id = fn;

		if (!interval) {
			fnLink = function () {
				links.delete(id);
				delete labels[label];
				fn.call(this, ...arguments);
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
				clearFn(val.id);
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
