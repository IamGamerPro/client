- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../i-block/' as placeholder

- template index(params) extends ['i-block'].index
	- block body
		< form.&__form &
			ref = form |
			:id = id |
			:name = name |
			:action = action |
			v-e:submit.prevent = submit |
			novalidate
		.
			< slot
