/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

const
	$C = require('collection.js').$C;

const NODE_ENV = $C(process.argv).reduce(function (env, el, i, data) {
	if (el === '--env') {
		env = data[i + 1] || env;
	}

	return env;

}, 'stage');

process.env.NODE_ENV = NODE_ENV;
const config = require('config');

const
	fs = require('fs'),
	path = require('path'),
	query = require('querystring');

const
	nib = require('nib'),
	autoprefixer = require('autoprefixer');

const
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

const
	output = './dist/packages/[name]',
	packages = path.resolve(__dirname, 'dist/packages'),
	lib = path.resolve(__dirname, 'bower_components'),
	node = path.resolve(__dirname, 'node_modules'),
	builds = path.resolve(__dirname, 'src/builds'),
	blocks = path.resolve(__dirname, 'src/blocks'),
	images = path.resolve(__dirname, 'img');

const build = function () {
	const
		common = [],
		entry = {},
		graph = {};

	$C(fs.readdirSync(builds)).forEach(function (el) {
		const
			src = path.join(builds, el),
			include = /^import\s+'\.\/(.*?)';/m.exec(fs.readFileSync(src, 'utf8')),
			elName = path.basename(el, '.js');

		graph[elName] = graph[elName] || {file: elName};

		if (include) {
			const
				includeName = path.basename(include[1], '.js');

			common.push(includeName);
			graph[elName].parent = graph[includeName] = graph[includeName] || {file: includeName};
		}

		entry[elName] = [src];
	});

	function f(el, arr) {
		arr.push(el.file);
		if (el.parent) {
			f(el.parent, arr);
		}
	}

	return {
		entry: entry,
		common: entry.length <= 1 ? [] : common,
		dependencies: $C(graph).reduce(function (map, el) {
			map[el.file] = [];

			if (el.parent) {
				f(el.parent, map[el.file]);
			}

			map[el.file].push(el.file);
			return map;
		}, {})
	}
}();

module.exports = {
	entry: build.entry,

	output: {
		path: __dirname,
		filename: output + '.js'
	},

	externals: {
		eventemitter2: 'EventEmitter2',
		snakeskin: 'Snakeskin',
		'collection.js': '$C',
		sprint: 'Sprint'
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
					stage: 0,
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
				loader: ExtractTextPlugin.extract(
					'style',
					'css?' + (config.css ? query.stringify(config.css) : '') + '!postcss!stylus'
				)
			},

			{
				test: /\.ss$/,
				loader: 'snakeskin',
				query: config.snakeskin
			},

			{
				test: /\.ess$/,
				loader: 'file?name=' + output + '.html!snakeskin?' +
					query.stringify(
						$C.extend(true, {data: JSON.stringify({
							root: __dirname,
							lib: lib,
							node: node,
							builds: builds,
							blocks: blocks,
							images: images,
							packages: packages,
							dependencies: build.dependencies
						})}, config.snakeskin, {exec: true})
					)
			}
		]
	},

	plugins: [
		new ExtractTextPlugin(output + '.css')

	].concat(
		build.common.length ?
			new webpack.optimize.CommonsChunkPlugin({
				names: build.common,
				async: false
			}) : [],

		config.uglify ?
			new webpack.optimize.UglifyJsPlugin(config.uglify) : []

	),

	postcss: function () {
		return [autoprefixer];
	},

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
						'(?:[\\s\\S]*?\\.extends\\(\'([^)]*)\'\\)|)' +
						'(?:[\\s\\S]*?\\.dependencies\\(\'([^)]*)\'\\)|)' +
					';', 'm'
				);

				function include(name, ext) {
					const src = path.resolve(path.join(blocks, path.join(name, name) + ext));

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
					res += include(name, '.ess');
					res += include(name, '.styl');

					return res;
				});
			}
		]
	}
};
