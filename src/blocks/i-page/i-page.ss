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

- import Typograf from 'typograf'

/**
 * Decorator for Typograf
 * @decorator
 */
- template typograf(params) @= renderAs 'template'
	- return
		() => target
			- return
				() =>
					- return new Typograf(params).execute(target.apply(this, arguments))

/**
 * Adds template dependencies
 * @param {!Object} dependencies
 */
- block index->addDependencies(dependencies)
	- forEach dependencies[path.basename(__filename, '.ess')] => el
		- link (href = ${el}.css)
		- script (src = ${el}.js)

- @typograf({lang: @@lang || 'ru'})
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

	- block root
		- doctype
		< html
			< head
				< meta charset = utf-8
				< title
					{title = 'IamGamer.pro' ?}

				- block head
					+= std.html.cdn('fontAwesome@4.4.0')

					- script (src = ${path.join(lib, 'collection.js/dist/collection.min.js')})
					- script (src = ${path.join(node, 'babel-core/browser-polyfill.min.js')})
					- script (src = ${path.join(node, 'snakeskin/dist/snakeskin.live.min.js')})

					: libs = [ &
						'validator-js/validator.min.js',
						'sugar/release/sugar.min.js',
						'eventemitter2/lib/eventemitter2.js',
						'sprint/index.js',
						'vue/dist/vue.min.js',
						'qs/dist/qs.js',
						'js-keycodes/keycodes.min.js',
						'localforage/dist/localforage.min.js'
					] .

					- forEach libs => url
						- script (src = ${path.join(lib, url)})

			- pageData = {}
			- pageName = /\['(.*?)'\]/.exec(TPL_NAME)[1]

			< body.i-page.${pageName} &
				-init-block = ${pageName} |
				-${pageName}-params = ${{data: pageData}|json}
			.
				< b-background.&__vert-flex :mods = {theme: 'dark'} | :block-name = 'back'
					- block body
