- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-data/i-data' as placeholder

- template index(params) extends ['i-data'].index
	- block body
		- super
		- block status
			< b-progress :value = status
