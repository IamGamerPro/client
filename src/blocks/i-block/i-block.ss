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
	- block root
		< ${@tag}.${/\['(.*?)'\]/.exec(TPL_NAME)[1]}
			< span.&__root-wrapper
				< span.&__over
					- block over
				- block body
			- block helpers
