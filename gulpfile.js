'use strict';

// jscs:disable requireTemplateStrings

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
	replace = require('gulp-replace'),
	header = require('gulp-header'),
	bump = require('gulp-bump'),
	run = require('gulp-run');

function getVersion() {
	const
		file = fs.readFileSync(path.join(__dirname, './index.js')),
		v = /VERSION\s*(?::|=)\s*\[(.*?)]/.exec(file)[1].split(/\s*,\s*/);

	return v.slice(0, 3).join('.') + (v[3] ? '-' + eval(v[3]) : '');
}

function getHead(version) {
	return '' +
		'/*!\n' +
		' * IamGamer.pro Client' + (version ? ' v' + getVersion() : '') + '\n' +
		' * https://github.com/IamGamerPro/client\n' +
		' *\n' +
		' * Released under the FSFUL license\n' +
		' * https://github.com/IamGamerPro/client/blob/master/LICENSE\n';
}

function error(cb) {
	return (err) => {
		console.error(err.message);
		cb();
	};
}

const
	headRgxp = /(\/\*![\s\S]*?\*\/\n{2})/;

let
	readyToWatcher = null,
	env = process.env.NODE_ENV = 'stage';

gulp.task('setProd', function (cb) {
	env = process.env.NODE_ENV = 'prod';
	cb();
});

gulp.task('copyright', (cb) => {
	gulp.src('./LICENSE')
		.pipe(replace(/(Copyright \(c\) )(\d+)-?(\d*)/, (sstr, intro, from, to) => {
			const year = new Date().getFullYear();
			return intro + from + (to || from != year ? '-' + year : '');
		}))

		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('head', (cb) => {
	readyToWatcher = false;
	const fullHead =
		getHead() +
		' */\n\n';

	gulp.src(['./@(src|config)/**/*.@(js|styl|ss)', './@(index|gulpfile|webpack.config).js'], {base: './'})
		.pipe(through.obj((file, enc, cb) => {
			if (!headRgxp.exec(file.contents.toString()) || RegExp.$1 !== fullHead) {
				this.push(file);
			}

			return cb();
		}))

		.pipe(replace(headRgxp, ''))
		.pipe(header(fullHead))
		.pipe(gulp.dest('./'))
		.on('end', () => {
			readyToWatcher = true;
			cb();
		});
});

gulp.task('bump', (cb) => {
	gulp.src('./*.json')
		.pipe(bump({version: getVersion()}))
		.pipe(gulp.dest('./'))
		.on('end', cb);
});

gulp.task('clean', (cb) => {
	del('./dist').then(() => cb(), cb);
});

gulp.task('build', /*['clean'],*/ (cb) => {
	run(`webpack --env ${env}`).exec()
		.on('error', error(cb))
		.on('finish', cb);
});

gulp.task('default', ['head', 'bump', 'build']);
gulp.task('prod', ['setProd', 'default']);
