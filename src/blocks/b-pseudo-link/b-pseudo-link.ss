- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../b-link/' as placeholder

- template index(params) extends ['b-link'].index
	- block a
		< span.&__cell.&__link &
			:data-title = title |
			v-if = ifEveryMods(['disabled', 'progress'], false) |
			${attrs}
		.
			< slot
