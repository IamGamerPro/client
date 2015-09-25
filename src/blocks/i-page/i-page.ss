/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-base/i-base' as placeholder

- template [%fileName%](params) extends ['i-base']
	- lib = '../../bower_components/'

	- fs = require('fs')
	- path = require('path')

	- block methods

		/**
		 * Adds template dependencies
		 */
		- block addDependencies(dependencies)
			- forEach dependencies[path.basename(__filename, '.ess')] => el
				- try
					- if fs.statSync(path.join(@packages, el + '.css'))
						- link :: {el}.css

				- try
					- if fs.statSync(path.join(@packages, el + '.js'))
						- script js src = ${el}.js

	- block root
		- doctype
		< html
			< head
				< meta charset = utf-8
				- block head
					- script js src = ${path.join(lib, 'snakeskin/dist/snakeskin.min.js')}
					- script js src = ${path.join(lib, 'sugar/release/sugar.min.js')}
					- script js src = ${path.join(lib, 'uid/uid.js')}

			< body.i-page.${'' + /\['(.*?)'\]/.exec(path.basename(TPL_NAME, '.ss'))[1]}
				- block body
