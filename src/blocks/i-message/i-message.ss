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
	- block helpers
		- super
		- block message
			- forEach ['error', 'info'] => el
				< ${rootTag}.&__message-box.&__${el}
					< ${rootTag}.&__message-content
						{{ ${el}Msg }}
