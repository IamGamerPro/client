'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

const
	path = require('path'),
	fs = require('fs');

const regexp = new RegExp(
	'^\\s*' +
	'package\\(\'([^)]*)\'\\)' +
	'(?:[\\s\\S]*?\\.extends\\(\'([^)]*)\'\\)|)' +
	'(?:[\\s\\S]*?\\.dependencies\\(\'([^)]*)\'\\)|)' +
	';', 'm'
);

function include(dir, name, ext) {
	try {
		if (fs.statSync(path.join(dir, name + ext)).isFile()) {
			return `require('./${name + ext}');\n`;
		}

	} catch (ignore) {}

	return '';
}

/**
 * WebPack loader for using dependencies from index.js of blocks
 * @param {string} source
 */
module.exports = function (source) {
	this.cacheable && this.cacheable();

	return source.replace(regexp, (matched, name, parent, dependencies) => {
		let res = '';

		this.addContextDependency(this.context);

		if (parent) {
			res += `require('../${parent}');\n`;
		}

		res += (dependencies || '')
			.replace(/'/g, '')
			.split(',')
			.map((str) => str.trim())
			.filter(Boolean)
			.map((el) => `require('../${el}');\n`)
			.join('');

		res += include(this.context, name, '.js');
		res += include(this.context, name, '.ss');
		res += include(this.context, name, '.ess');
		res += include(this.context, name, '.styl');

		return res;
	});
};
