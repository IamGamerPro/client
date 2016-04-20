- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-block/' as placeholder

- template index(params) extends ['i-block'].index
	- block helpers
		- super
		- block message
			- forEach ['error', 'info'] => el
				< ${self.tag()}.&__message-box.&__${el}
					< ${self.tag()}.&__message-content
						{{{ ${el}Msg }}}
