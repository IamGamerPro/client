/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

const
	fs = require('fs'),
	path = require('path'),
	del = require('del');

const
	gulp = require('gulp'),
	through = require('through2');

const
	webpack = require('gulp-webpack'),
	replace = require('gulp-replace'),
	header = require('gulp-header'),
	bump = require('gulp-bump'),
	run = require('gulp-run');

function getVersion() {
	const file = fs.readFileSync('./index.js');
	return /VERSION\s*(?::|=)\s*\[(\d+,\s*\d+,\s*\d+)]/.exec(file)[1]
		.split(/\s*,\s*/)
		.join('.');
}

function getHead(opt_version) {
	return '' +
		'/*!\n' +
		' * IamGamer.pro Client' + (opt_version ? ' v' + getVersion() : '') + '\n' +
		' * https://github.com/IamGamerPro/client\n' +
		' *\n' +
		' * Released under the FSFUL license\n' +
		' * https://github.com/IamGamerPro/client/blob/master/LICENSE\n';
}

function error(cb) {
	return function (err) {
		console.error(err.message);
		cb();
	};
}

const
	headRgxp = /(\/\*![\s\S]*?\*\/\n{2})/;

var
	readyToWatcher = null,
	env = process.env.NODE_ENV = 'stage';

gulp.task('setProd', function (cb) {
	env = process.env.NODE_ENV = 'prod';
	cb();
});

gulp.task('copyright', function (cb) {
	gulp.src('./LICENSE')
		.pipe(replace(/(Copyright \(c\) )(\d+)-?(\d*)/, function (sstr, intro, from, to) {
			var year = new Date().getFullYear();
			return intro + from + (to || from != year ? '-' + year : '');
		}))

		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('head', function (cb) {
	readyToWatcher = false;
	const fullHead =
		getHead() +
		' */\n\n';

	gulp.src(['./@(src|config)/**/*.@(js|styl|ss)', './@(index|gulpfile|webpack.config).js'], {base: './'})
		.pipe(through.obj(function (file, enc, cb) {
			if (!headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead) {
				this.push(file);
			}

			return cb();
		}))

		.pipe(replace(headRgxp, ''))
		.pipe(header(fullHead))
		.pipe(gulp.dest('./'))
		.on('end', function () {
			readyToWatcher = true;
			cb();
		});
});

gulp.task('bump', function (cb) {
	gulp.src('./*.json')
		.pipe(bump({version: getVersion()}))
		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('clean', function (cb) {
	del('./dist', cb);
});

gulp.task('build', ['clean'], function (cb) {
	run('webpack --env ' + env).exec()
		.on('error', error(cb))
		.on('finish', cb);
});

gulp.task('default', ['head', 'bump', 'build']);
gulp.task('prod', ['setProd', 'default']);
