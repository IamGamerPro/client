var cache = {};

/**
 * Объект управления событиями
 */
export class Observer {
	/** @param {Object=} [opt_eventObj] - регистратор событий (если не указан, то используется глобальный) */
	constructor(opt_eventObj) {
		this.cache = opt_eventObj || cache;
	}

	/** @constructor */
	static StopPropagation() {}

	/** @constructor */
	static StopImmediatePropagation() {}

	/**
	 * Вернуть по заданным параметрам специальный объект вида:
	 * {
	 *     link: ссылка для отмены события,
	 *     callback: ссылка на функцию-обработчик события
	 * }
	 *
	 * @param {(function(...[?]): ?|{callback: function(...[?]): ?, link: Object})} callback - функция обратного вызова
	 *     ИЛИ объект, где callback - функция-обработчик события, а link - функция,
	 *     которая будет использоваться как ссылка для удаления обработчика
	 *
	 * @return {{link, callback}}
	 */
	static getLink(callback) {
		var fn = callback,
			link = fn;

		if (!Function.isFunction(fn)) {
			fn = fn.callback;

			while (!Function.isFunction(link)) {
				link = link.link || link.callback;
			}
		}

		return {
			link: link,
			callback: fn
		};
	}

	/**
	 * Зарегистрировать обработчик указанного события
	 *
	 * @example
	 * var my = {};
	 * var observer = new Observer(my);
	 * observer.on('event', function () {
	 *     ...
	 * });
	 *
	 * @param {string} eventType - тип события (например, click, можно указывать несколько событий через пробел)
	 * @param {(function(...[?]): ?|{callback: function(...[?]): ?, link: Object})} callback - функция обратного вызова
	 *     (return false отменяет выполнение всех обработчиков)
	 *     ИЛИ объект, где callback - функция-обработчик, а link - функция, которая будет использоваться как ссылка
	 *     для удаления обработчика
	 *
	 * @param {(Object|number|boolean)=} [opt_params] - дополнительные параметры
	 *     (можно также задать как число или логическое значение,
	 *     для установки opt_params.count или opt_params.capturing соответственно)
	 *
	 * @param {?number=} [opt_params.count] - максимальное количество выполнений обработчика для данного события
	 * @param {?boolean=} [opt_params.capturing=false] - если true,
	 *     то события ловятся на погружении (только для DOM событий)
	 *
	 * @return {!Observer}
	 */
	on(eventType, callback, opt_params) {
		var link = Observer.getLink(callback);

		callback = link.callback;
		link = link.link;

		var p = Object.isObject(opt_params) ?
			opt_params : {};

		if (Number.isNumber(opt_params)) {
			p.count = opt_params;

		} else if (Boolean.isBoolean(opt_params)) {
			p.capturing = opt_params;
		}

		var eventObj = this.cache,
			cache;

		var isEl = isBOMEl(eventObj),
			capturing = Boolean(p.capturing);

		if (isEl && capturing) {
			cache =
				eventObj._captureEvent = eventObj._captureEvent || {};

		} else {
			cache =
				eventObj._event = eventObj._event || {};
		}

		$C(eventType.split(' ')).forEach((eventType) => {
			if (!eventType) {
				return;
			}

			var event = cache[eventType];

			if (!event) {
				cache[eventType] =
					event = {};

				let eventCallback = function () {
					return event.exec.apply(this, arguments)
				};

				if (isEl) {
					eventObj.addEventListener(eventType, eventCallback, capturing);
				}

				event.listener = eventCallback;
				event.links = [];
				event.actions = [];

				event.exec = function () {
					var args = Array.toArray(arguments);
					args.push(event);

					var rmList = [],
						res = true;

					var cancel = false;

					$C(event.actions).forEach((el, i) => {
						if (!el) {
							rmList.push(i);
							return;
						}

						if (!cancel && (!isExists(el.count) || el.count > 0)) {
							res = event.returnValue = el.callback.apply(this, args);
						}

						if (Number.isNumber(el.count)) {
							if (el.count > 0) {
								el.count--;
							}

							if (el.count === 0) {
								rmList.push(i);
							}
						}

						if (cancel) {
							return;
						}

						if (res === false || res instanceof Observer.StopImmediatePropagation) {
							cancel = true;
						}

					}, {live: true});

					$C(rmList).forEach((el) => {
						event.links
							.splice(el, 1);

						event.actions
							.splice(el, 1);

					}, {reverse: true});

					if (!event.actions.length) {
						if (isEl) {
							eventObj.removeEventListener(
								eventType,
								eventCallback,
								capturing
							);
						}

						delete cache[eventType];
					}

					delete event.returnValue;
					return res;
				};

			} else if (event.links._removed && isEl) {
				delete event.links._removed;
				eventObj.addEventListener(eventType, event.listener, capturing);
			}

			event.actions.push({
				callback: callback,
				count: p.count
			});

			event.links.push(link);
		});

		return this;
	}

	/**
	 * Удалить обработчик/и указанного события
	 *
	 * @param {string} eventType - тип события (например, click, можно указывать несколько событий через пробел)
	 * @param {Function=} [opt_link] - ссылка на функцию-обработчик (если не указана,
	 *     то удаляются все имеющиеся обработчики)
	 *
	 * @param {(Object|boolean)=} [opt_params] - дополнительные параметры
	 *     (можно указать как логическое значение для установки opt_params.capturing)
	 *
	 * @param {?boolean=} [opt_params.capturing=false] - если true, то событие установлено на погружении
	 *     (только для DOM событий)
	 *
	 * @return {!Observer}
	 */
	off(eventType, opt_link, opt_params) {
		var p = Object.isObject(opt_params) ?
			opt_params : {};

		if (Boolean.isBoolean(opt_params)) {
			p.capturing = opt_params;
		}

		var eventObj = this.cache,
			isEl = isBOMEl(eventObj);

		var cache = isEl && p.capturing ?
			eventObj._captureEvent : eventObj._event;

		if (cache) {
			$C(eventType.split(' ')).forEach((eventType) => {
				if (!eventType) {
					return;
				}

				if (cache[eventType]) {
					let event = cache[eventType];

					$C(event.links).forEach((el, i) => {
						// Для удаления событий из .off используем delete,
						// а не splice, чтобы не возникла ошибка при вызове .off из .on
						if (!opt_link || el === opt_link) {
							delete event.actions[i];
							delete event.links[i];
						}
					});

					if (isEl && $C(event.links).every((el) => !el)) {
						event.links._removed = true;
						eventObj.removeEventListener(
							eventType,
							cache[eventType].listener,
							Boolean(p.capturing)
						);
					}
				}
			});
		}

		return this;
	}

	/**
	 * Удалить все обработчики событий, установленные через Observer->on
	 *
	 * @param {?boolean=} [opt_stage] - если true, то будут удаляться только те обработчики,
	 *     которые установлены на погружении, а если false, то только те, которые установлены на всплытии
	 *     (только для DOM событий)
	 *
	 * @return {!Observer}
	 */
	clearAllEvents(opt_stage) {
		var eventObj = this.cache;
		var ce = eventObj._captureEvent,
			e = eventObj._event;

		if (isBOMEl(eventObj) && Boolean.isBoolean(opt_stage)) {
			$C(opt_stage ? ce : e).forEach((el, key) => {
				this.off(key, null, opt_stage);
			});

		} else {
			$C([ce, e]).forEach((event, i) => {
				$C(event).forEach((el, key) => {
					this.off(key, null, i === 0);
				});
			});
		}

		return this;
	}

	/**
	 * Вызвать обработчики указанного события явно
	 *
	 * @param {string} eventType - тип события (например, click, можно указывать несколько событий через пробел)
	 * @param {?=} [opt_eventParams] - передаваемый параметр для обработчиков или массив параметров
	 *
	 * @param {(Object|boolean)=} [opt_params] - дополнительные параметры
	 *     (можно указать как логическое значение для установки opt_params.capturing)
	 *
	 * @param {?boolean=} [opt_params.capturing=false] - если true, то событие установлено на погружении
	 *     (только для DOM событий)
	 *
	 * @param {Object=} [opt_thisObject] - контекст вызова функции-обработчика
	 * @return {?}
	 */
	trigger(eventType, opt_eventParams, opt_params, opt_thisObject) {
		var args = Array.toArgs(opt_eventParams),
			p = Object.isObject(opt_params) ?
				opt_params : {};

		if (Boolean.isBoolean(opt_params)) {
			p.capturing = opt_params;
		}

		var eventObj = this.cache,
			res = true;

		var cache = isBOMEl(eventObj) && p.capturing ?
			eventObj._captureEvent : eventObj._event;

		if (cache) {
			$C(eventType.split(' ')).forEach((eventType) => {
				if (!eventType) {
					return;
				}

				if (cache[eventType]) {
					res = cache[eventType].listener.apply(opt_thisObject || eventObj, args);
				}
			});
		}

		return res;
	}
}
