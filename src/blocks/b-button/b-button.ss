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

		: attrs = {}
		- block attrs() =>

		- block buttonContent()
			< span.&__wrapper
				< span.&__cell.&__pre-icon v-if = preIcon
					< b-icon :value = preIcon

				< span.&__cell.&__value
					< slot

				< span.&__cell.&__icon v-if = icon
					< b-icon :value = icon

				< span.&__cell.&__icon.&__progress
					< b-progress-icon :mods = {size: mods.size, theme: mods.theme}

		- block button
			< button.&__button :type = type | :form = form | :data-title = title | ${attrs}
				+= self.buttonContent()
