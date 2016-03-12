'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

exports.VERSION = [0, 0, 2];

const
	path = require('path');

const
	PORT = 1989,
	DIST = path.join(__dirname, 'dist/packages');

const
	express = require('express'),
	app = express();

app
	.use('/dist', express.static('dist'))
	.use('/node_modules', express.static('node_modules'))
	.use('/bower_components', express.static('bower_components'))
	.use('/img', express.static('img'));

app
	.get('/', (req, res) => res.sendFile(path.join(DIST, 'p-auth.html')))
	.get('/test', (req, res) => res.sendFile(path.join(DIST, 'p-test.html')))
	.get('/**', (req, res) => res.sendFile(path.join(DIST, 'p-master.html')))
	.listen(PORT);

console.log(`Server started at localhost:${PORT}`);
