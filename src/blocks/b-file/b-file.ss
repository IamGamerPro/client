- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../b-button/' as placeholder

- template index(params) extends ['b-button'].index
	- block button
		- super
		< input.&__file ref = file | type = file | :accept = accept | v-e:change = onFileSelected
