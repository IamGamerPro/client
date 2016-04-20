- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-base/' as placeholder

- template index(params) extends ['i-base'].index
	- block tag()
		- if @tag === 'div'
			- return 'div'

		- return 'span'

	- block root
		< ${@tag}.${self.name()}
			< ${self.tag()}.&__root-wrapper
				< ${self.tag()}.&__over
					- block over
				- block body
			- block helpers
