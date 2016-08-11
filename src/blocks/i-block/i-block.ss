- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../i-base/' as placeholder
: rootTag = 'div'

- template index(params) extends ['i-base'].index
	- block root
		< ${rootTag}.${self.name()}
			< ${rootTag}.&__root-wrapper
				< ${rootTag}.&__over
					- block over
				- block body
			- block helpers
