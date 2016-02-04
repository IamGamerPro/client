- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../../../node_modules/std.ss/html' as template
- include '../i-base/i-base' as placeholder

- placeholder index(params) extends ['i-base'].index
	- fs = require('fs')
	- path = require('path')

	- root = path.relative(@packages, @root)
	- lib = path.relative(@packages, @lib)
	- node = path.relative(@packages, @node)
	- builds = path.relative(@packages, @builds)
	- blocks = path.relative(@packages, @blocks)
	- images = path.relative(@packages, @images)
	- packages = path.relative(@packages, @packages)

	- block methods

		/**
		 * Adds template dependencies
		 */
		- block addDependencies(dependencies)
			- forEach dependencies[path.basename(__filename, '.ess')] => el
				- try
					/// - if fs.statSync(path.join(@packages, el + '.css'))
						- link :: {el}.css

				- try
					/// - if fs.statSync(path.join(@packages, el + '.js'))
						- script js src = ${el}.js

	- block root
		- doctype
		< html
			< head
				< meta charset = utf-8
				< title
					{title = 'IamGamer.pro' ?}

				- block head
					+= std.html.cdn('fontAwesome@4.4.0')
					- script js src = ${path.join(node, 'babel-core/browser-polyfill.min.js')}
					- script js src = ${path.join(node, 'snakeskin/dist/snakeskin.live.min.js')}

					: libs = [ &
						'collection.js/dist/collection.min.js',
						'sugar/release/sugar.min.js',
						'eventemitter2/lib/eventemitter2.js',
						'sprint/index.js',
						'vue/dist/vue.min.js',
						'qs/dist/qs.js'
					] .

					- forEach libs => url
						- script js src = ${path.join(lib, url)}

			- pageParams = {}
			< body.i-page.${/\['(.*?)'\]/.exec(TPL_NAME)[1]} &
				-init-block = p-auth |
				-p-auth-params = ${{data: pageParams}|json}
			.
				< b-background :mods = {theme: 'dark'} | :name = 'back'
					- block body
