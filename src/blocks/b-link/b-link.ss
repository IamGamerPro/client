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
		- block link
			: attrs = {}
			- block attrs() =>
			< .&__wrapper
				< .&__cell.&__pre-icon v-if = preIcon
					< b-icon :value = preIcon
					&nbsp;

				< a.&__cell.&__link ( &
					:href = href |
					:data-title = title |
					v-if = ifEveryMods(['disabled', 'progress'], false) |
					${attrs}
				) .
					< slot

				< .&__cell.&__pseudo-link (v-if = ifSomeMod(['disabled', 'progress'], true) | :data-title = title)
					< slot

				< .&__cell.&__icon v-if = icon
					< b-icon :value = icon

				< .&__cell.&__icon.&__progress
					< b-progress-icon :mods = {size: mods.size, theme: mods.theme}
