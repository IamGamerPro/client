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
		- block group
			< .&__title
				< .&__cell.&__title-text
					< slot name = title
						{{ title }}

				< .&__cell.&__toggle
					< b-icon &
						:value = ifSomeMod(['opened'], true) ? 'caret-up' : 'caret-down' |
						:mods = baseMods |
						@click = ifSomeMod(['opened'], true) ? close() : open()
					.

			< .&__content
				< slot name = body
