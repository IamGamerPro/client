/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

const
	$C = require('collection.js').$C;

const
	fs = require('fs'),
	path = require('path'),
	nib = require('nib');

const
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

const build = function () {
	const
		builds = path.resolve(__dirname, 'src/builds'),
		common = [],
		entry = {};

	$C(fs.readdirSync(builds)).forEach(function (el) {
		const
			src = path.join(builds, el),
			include = /^import\s+'\.\/(.*?)';/.exec(fs.readFileSync(src, 'utf8'));

		if (include) {
			common.push(path.basename(include[1], '.js'));
		}

		entry[path.basename(el, '.js')] = [src];
	});

	return {
		entry: entry,
		common: common
	}
}();

module.exports = {
	entry: build.entry,

	output: {
		path: __dirname,
		filename: './dist/packages/[name].js'
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				query: {
					compact: false,
					auxiliaryCommentBefore: 'istanbul ignore next',
					loose: 'all',
					optional: [
						'spec.undefinedToVoid'
					]
				}
			},

			{
				test: /\.js$/,
				loader: 'monic?flags=mode:package'
			},

			{
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract('style', 'css!stylus')
			},

			{
				test: /\.ss$/,
				loader: 'snakeskin?prettyPrint=true'
			}
		]
	},

	plugins: [
		new webpack.optimize.CommonsChunkPlugin({names: build.common}),
		new ExtractTextPlugin('./dist/packages/[name].css')
	],

	stylus: {
		use: [nib()]
	},

	monic: {
		replacers: [
			function (text) {
				if (this.flags.mode !== 'package') {
					return text;
				}

				const rgxp = new RegExp(
					'^\\s*' +
						'package\\(\'([^)]*)\'\\)' +
						'(?:[\s\S]*?\\.extends\\(\'([^)]*)\'\\)|)' +
						'(?:[\s\S]*?\\.dependencies\\(\'([^)]*)\'\\)|)' +
					';'
				);

				function include(name, ext) {
					const src = path.resolve(__dirname, 'src/blocks', path.join(name, name) + ext);

					try {
						if (fs.statSync(src).isFile()) {
							return 'require(\'./' + name + ext + '\');\n';
						}

					} catch (ignore) {}

					return '';
				}

				return text.replace(rgxp, function (sstr, name, parent, dependencies) {
					var res = '';

					dependencies = $C((dependencies || '').split(',')).map(function (el) {
						return el.trim();
					});

					if (parent) {
						res += 'require(\'../' + parent + '\');\n';
					}

					res += $C(dependencies).reduce(function (res, el) {
						if (el) {
							return res += 'require(\'../' + el + '\');\n';
						}

						return res;
					}, '');

					res += include(name, '.js');
					res += include(name, '.ss');
					res += include(name, '.styl');

					return res;
				});
			}
		]
	}
};
