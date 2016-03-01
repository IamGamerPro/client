- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../b-nav-list/b-nav-list' as placeholder

- template index(params) extends ['b-nav-list'].index
	- block list
		- super
		< b-input-search.&__search &
			:mods = {theme: 'light-form', rounding: 'big', inverseBorder: true, block: true} |
			:name = 'search' |
			:placeholder = '`Поиск`'
		.
