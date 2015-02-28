/**
 * Разбить исходную строку на параметры и вернуть массив частей, т.е.
 * '1,[1,2,3],"foo"' => [
 *     1,
 *     [1,2,3],
 *     "foo"
 * ]
 *
 * @param {Array=} [opt_quotContent] - массив строк для замены констант экранирования литералов на реальное содержимое
 *     (результат работы Escaper.replace)
 *
 * @return {!Array.<string>}
 */
String.prototype.splitParams = function (opt_quotContent) {
	var params = [];
	var isSys = 0,
		tmp = '';

	var content = [],
		str = this;

	if (!opt_quotContent) {
		str = Escaper.replace(this, true, content);
	}

	var open = {
		'(': true,
		'{': true,
		'[': true
	};

	var close = {
		')': true,
		'}': true,
		']': true
	};

	$C(str).forEach((el) => {
		if (open[el]) {
			isSys++;

		} else if (close[el]) {
			isSys--;
		}

		if (!isSys && el === ',') {
			params.push(tmp);
			tmp = '';

		} else {
			tmp += el;
		}
	});

	params.push(tmp);
	return $C(params).map((el) => {
		if (el) {
			let val = Escaper.paste(el, opt_quotContent || content),
				obj;

			try {
				obj = Object.parse(val);

			} catch (ignore) {
				obj = val;
			}

			return obj;
		}
	});
};

/**
 * Преобразовать исходную строку из dash-style в camelCase
 * @return {string}
 */
String.prototype.convertDashStyleToCamelCase = function () {
	var up = false;
	return $C(this).reduce((res, el) => {
		if (el === '-') {
			up = true;
			return res;
		}

		res += up ? el.toUpperCase() : el;
		up = false;

		return res;
	}, '');
};

/**
 * Преобразовать исходную строку из camelCase в dash-style
 * @return {string}
 */
String.prototype.convertCamelCaseToDashStyle = function () {
	return $C(this).reduce((res, el) => {
		var lc = el.toLowerCase();
		return res + (el !== lc ? '-' : '') + lc;
	}, '');
};
