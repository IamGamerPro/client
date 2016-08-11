- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../i-data/' as placeholder
: rootTag = 'span'

- template index(params) extends ['i-data'].index
	- block body
		- super

		: attrs = {}
		- block attrs() =>

		- block link
			< .&__wrapper
				< .&__cell.&__pre-icon v-if = preIcon
					< b-icon :value = preIcon | :init-mods = baseMods

				- block a
					< a.&__cell.&__link &
						:href = href |
						:data-title = title |
						v-if = ifEveryMods(['disabled', 'progress'], false) |
						${attrs}
					.
						< slot

				< .&__cell.&__pseudo-link v-if = ifSomeMod(['disabled', 'progress'], true) | :data-title = title
					< slot

				< .&__cell.&__icon v-if = icon
					< b-icon :value = icon | :init-mods = baseMods

				< .&__cell.&__icon.&__progress
					< b-progress-icon :init-mods = baseMods
