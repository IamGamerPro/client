- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../b-input/b-input' as placeholder

- template index(params) extends ['b-input'].index
	- block attrs()
		? attrs[':options'] = 'options'
