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

		- block button
			< button.&__button ref = button | :type = type | :form = form | :data-title = title | ${attrs}
				< span.&__wrapper
					< span.&__cell.&__pre-icon v-if = preIcon
						< b-icon :value = preIcon | :init-mods = baseMods

					< span.&__cell.&__value
						< slot

					< span.&__cell.&__icon v-if = icon
						< b-icon :value = icon | :init-mods = baseMods

					< span.&__cell.&__icon.&__progress
						< b-progress-icon :init-mods = baseMods
