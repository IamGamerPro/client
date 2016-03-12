- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include 'std.ss/html' as template
- include '../i-base/' as placeholder

- import fs from 'fs'
- import path from 'path'
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
 * Normalizes the specified url
 * @param {string} url
 */
- block index->normalize(url)
	- return url.replace(/\\/g, '/')

/**
 * Joins the specified urls
 * @param {...string} url
 */
- block index->join()
	- return self.normalize(path.join.apply(path, arguments))

/**
 * Adds template dependencies
 * @param {!Object} dependencies
 */
- block index->addDependencies(dependencies)
	- forEach dependencies[path.basename(__filename, '.ess')] => el
		- link css href = ${self.normalize(el)}.css
		- script js src = ${self.normalize(el)}.js

- @typograf({lang: @@lang || 'ru'})
- placeholder index(params) extends ['i-base'].index
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

					: base = self.join('/', path.relative(@root, @packages), '/')
					< base href = ${base}
					# script
						var BASE = '#{base}';

					- script js src = ${self.join(lib, 'collection.js/dist/collection.min.js')}
					- script js src = ${self.join(node, 'babel-core/browser-polyfill.min.js')}
					- script js src = ${self.join(node, 'snakeskin/dist/snakeskin.live.min.js')}

					: libs = [ &
						'DOM4/build/dom4.js',
						'validator-js/validator.min.js',
						'sugar/release/sugar.min.js',
						'eventemitter2/lib/eventemitter2.js',
						'sprint/index.js',
						'vue/dist/vue.min.js',
						'js-keycodes/keycodes.min.js',
						'localforage/dist/localforage.min.js'
					] .

					- block libs

					- forEach libs => url
						- script js src = ${self.join(lib, url)}

					+= self.addDependencies(@dependencies)

			- pageData = {}
			- pageName = /\['(.*?)'\]/.exec(TPL_NAME)[1]

			< body.i-page.${pageName} &
				-init-block = ${pageName} |
				-${pageName}-params = ${{data: pageData}|json}
			.
				< b-background.&__vert-flex :mods = {theme: 'dark'} | :block-name = 'back'
					- block body
