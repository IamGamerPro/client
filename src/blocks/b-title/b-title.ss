- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-data/' as placeholder

- template index(params) extends ['i-data'].index
	- block body
		- super
		< .&__data-wrapper v-if = data
			- block title
				< .&__head
					< h1.&__title
						{{ data.login }}
						< span.&__desc
							{{ desc || (data.emails ? '(`это ты`)' : '') }}

					< b-input-search.&__search &
						v-ref:search |
						v-if = search |
						:placeholder = searchPlaceholder || '`Поиск`' |
						:mods = {theme: 'dark-form', size: lt[mods.size], rounding: 'big'}
					.

				< b-status.&__status v-ref:status | v-if = status | :user-id = userId
