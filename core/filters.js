var obj = $C();

obj.addFilter({
	'trim': function (el, key, data) {
		if (String.isString(el)) {
			data[key] =
				el = data[key].trim();
		}

		this.$.el = el;
		return this.TRUE;
	}
});
