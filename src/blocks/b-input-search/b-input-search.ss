- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../b-input/' as placeholder

- template index(params) extends ['b-input'].index
	- block icons
		- super
		< .&__cell.&__icon.&__search
			< b-icon :value = 'search' | :init-mods = baseMods
