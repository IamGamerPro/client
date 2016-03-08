- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-dynamic-page/i-dynamic-page' as placeholder

- template index(params) extends ['i-dynamic-page'].index
	- block body
		- super
		- block page
