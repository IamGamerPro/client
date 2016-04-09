- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-message/' as placeholder

- template index(params) extends ['i-message'].index
	- block body
		- super
		- block exit
			< .&__wrapper -title = `Выйти из профиля`
				< .&__cell.&__exit
					< b-icon :mods = {theme: mods.theme, size: mods.size} | :value = 'remove'

				< .&__cell.&__progress
					< b-progress-icon
