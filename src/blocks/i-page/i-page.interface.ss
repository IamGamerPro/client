- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
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
					{title = 'TravelChat' ?}

				- block head
					+= std.html.cdn('fontAwesome@4.4.0')

					: base = self.join('/', path.relative(@root, @packages), '/')
					< base href = ${base}
					# script
						var BASE = '#{base}';

					: styles = [ &
						'animate.css/animate.min.css'
					] .

					- block styles
					- forEach styles => url
						- link css href = ${self.join(lib, url)}

					: libs = [ &
						'core-js/client/shim.min.js',
						'DOM4/build/dom4.js',
						'sugar/dist/sugar.min.js',
						'collection.js/dist/collection.min.js',
						'vue/dist/vue.js',
						'validator-js/src/validator.js',
						'eventemitter2/lib/eventemitter2.js',
						'localforage/dist/localforage.min.js',
						'URIjs/src/URI.min.js'
					] .

					- block libs
					- forEach libs => url
						- script js src = ${self.join(lib, url)}

					# script
						Sugar.extend();

					+= self.addDependencies(@dependencies)

			- pageData = {}
			- pageName = self.name()

			< body.i-page.${pageName} &
				-init-block = ${pageName} |
				-${pageName}-params = ${{data: pageData}|json}
			.
				- block body
