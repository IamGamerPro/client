/** @see {Collection.extend} */
Object.extend = Collection.extend;

/** @see {Collection.clone} */
Object.clone = Collection.clone;

/**
 * Попытаться преобразовать заданные данные в объект
 * (аналог JSON.parse, только без дополнительных правил валидации),
 * а если конвертация невозможна, то вернуть исходные данные
 *
 * @param {?} obj - исходный объект
 * @return {?}
 */
Object.parse = function (obj) {
	if (Object.isObject(obj)) {
		return obj;
	}

	try {
		obj = new Function(`return ${obj}`)();

	} catch (ignore) {}

	return obj;
};

/**
 * Создать новый объект с заданным прототипом.
 * Полученный объект будет дополнительно иметь свойство __base,
 * которое будет ссылаться на родительский объект
 *
 * @param {!Object} parent - родительский объект
 * @return {!Object}
 */
Object.inherit = function (parent) {
	var obj = Object.create(parent);
	obj.__base__ = parent;
	return obj;
};

/**
 * Вернуть ключ первого свойства заданного объекта
 *
 * @param {!Object} obj - исходный объект
 * @return {string}
 */
Object.key = function (obj) {
	return Object.keys(obj)[0];
};

/**
 * Вернуть строковое представление заданного объекта:
 * для массивов и простых объектов используется преобразование в JSON,
 * а для остальных toString
 *
 * @param {?} obj - исходный объект
 * @return {string}
 */
Object.toTransport = function (obj) {
	if (isUndef(obj)) {
		return '';
	}

	if (Object.isCollection(obj)) {
		return JSON.stringify(obj);

	} else {
		return String(obj);
	}
};

/**
 * Установить свойство length для заданного объекта
 *
 * @param {!Object} obj - исходный объект
 * @return {!Object}
 */
Object.setLength = function (obj) {
	Object.defineProperty(obj, 'length', {
		enumerable: false,
		writable: true,
		configurable: true,
		value: $C(obj).length()
	});

	return obj;
};
