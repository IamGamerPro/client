/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-block/i-block' as placeholder

- template [%fileName%](params) extends ['i-block']
	- block body
		- block message
			- forEach ['error', 'info'] => el
				< span.&__i-el.&__i-bar.&__${el}
					< span.&__i-el.&__i-arrow
					< span.&__i-el.&__i-bar-msg.&__${el}-msg
						{{${el}Msg}}
