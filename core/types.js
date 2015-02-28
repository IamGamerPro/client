/**
 * Вернуть true, если заданный объект является логическим
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
Boolean.isBoolean = function (obj) {
	return typeof obj === 'boolean';
};

/**
 * Вернуть true, если заданный объект является строкой
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
String.isString = function (obj) {
	return typeof obj === 'string';
};

/**
 * Вернуть true, если заданный объект является числом
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
Number.isNumber = function (obj) {
	return typeof obj === 'number';
};

/**
 * Вернуть true, если заданный объект является регулярным выражением
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
RegExp.isRegExp = function (obj) {
	return obj instanceof RegExp;
};

/**
 * Вернуть true, если заданный объект является датой
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
Date.isDate = function (obj) {
	return obj instanceof Date;
};

/**
 * Вернуть true, если заданный объект является функцией
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
Function.isFunction = function (obj) {
	return typeof obj === 'function';
};

/**
 * Вернуть true, если заданный объект является объектом
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
Object.isObject = function (obj) {
	return obj instanceof Object;
};

/**
 * Вернуть true, если заданный объект является простым ({ ... })
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
Object.isPlainObject = function (obj) {
	return Boolean(obj) && obj.constructor === Object;
};

/**
 * Вернуть true, если заданный объект является
 * хеш-таблицей (new Object или литерал) или массивом
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
Object.isCollection = function (obj) {
	return Boolean(obj) && (Array.isArray(obj) || Object.isPlainObject(obj));
};

/**
 * Вернуть true, если заданный объект является DOM узлом или окном обозревателя
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
global.isBOMEl = function (obj) {
	return obj instanceof Node || obj instanceof Window;
};

/**
 * Вернуть true, если заданный объект не определён (undefined)
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
global.isUndef = function (obj) {
	return obj === undefined;
};

/**
 * Вернуть true, если заданный объект равен null
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
global.isNull = function (obj) {
	return obj === null;
};

/**
 * Вернуть true, если заданный объект не равен null и undefined
 *
 * @param {?} obj - исходный объект
 * @return {boolean}
 */
global.isExists = function (obj) {
	return obj != null;
};
