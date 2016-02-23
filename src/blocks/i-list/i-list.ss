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
		- block list
			< .&__el v-for = el in list
				< a.&__link (:class = getElClasses({link: {active: el.active}}) | :href = el.href)
