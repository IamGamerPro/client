'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

const
	$C = require('collection.js').$C;

const NODE_ENV = $C(process.argv).reduce((env, el, i, data) => {
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
	autoprefixer = require('autoprefixer'),
	stylus = require('stylus');

const
	webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

const
	output = './dist/packages/[name]',
	packages = path.resolve(__dirname, 'dist/packages'),
	node = path.resolve(__dirname, 'node_modules'),
	lib = path.resolve(__dirname, 'bower_components'),
	builds = path.resolve(__dirname, 'src/builds'),
	blocks = path.resolve(__dirname, 'src/blocks'),
	images = path.resolve(__dirname, 'img');

const build = (() => {
	const
		common = [],
		entry = {},
		graph = {};

	$C(fs.readdirSync(builds)).forEach((el) => {
		const
			src = path.join(builds, el),
			include = /^import\s+'\.\/(.*?)';/m.exec(fs.readFileSync(src, 'utf8')),
			elName = path.basename(el, '.js');

		graph[elName] = graph[elName] || {file: elName};

		if (include) {
			const includeName = path.basename(include[1], '.js');
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
		common: $C(entry).length() <= 1 ? [] : common,
		dependencies: $C(graph).reduce((map, el) => {
			map[el.file] = [];

			if (el.parent) {
				f(el.parent, map[el.file]);
			}

			map[el.file].push(el.file);
			return map;
		}, {})
	};

})();

module.exports = {
	entry: build.entry,

	output: {
		path: __dirname,
		filename: `${output}.js`
	},

	externals: {
		'collection.js': '$C',
		'eventemitter2': 'EventEmitter2',
		'snakeskin': 'Snakeskin',
		'sprint': 'Sprint',
		'vue': 'Vue',
		'qs': 'Qs'
	},

	resolve: {
		alias: {
			'uuid': path.resolve(__dirname, 'bower_components/uuid'),
			'uuid/rng-browser': path.resolve(__dirname, 'bower_components/uuid/rng-browser')
		}
	},

	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel'
			},

			{
				test: /index\.js$/,
				loader: 'block'
			},

			{
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract(
					'style',
					`css?${config.css ? query.stringify(config.css) : ''}!postcss!stylus`
				)
			},

			{
				test: /\.ss$/,
				loader: 'snakeskin',
				query: config.snakeskin
			},

			{
				test: /\.ess$/,
				loader: `file?name=${output}.html!snakeskin?` +
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
		use: [
			nib(),
			(style) => {
				style.define('dataURI', (mime, str) => {
					return `data:${mime.string};base64,${Buffer(str.string).toString('base64')}`;
				});

				style.define('fromSvg', (str) => {
					return `data:image/svg+xml;base64,${Buffer(
						'<?xml version="1.0" encoding="utf-8"?>' +
						'<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">' +
						str.string.replace(
							'<svg ',
							'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" '
						)
					).toString('base64')}`;
				});

				style.define('file-exists', function (path) {
					return Boolean(stylus.utils.find(path.string, this.paths));
				});
			}
		]
	}
};
