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
		< button.&__button type = {{type}} | form = {{form}}
			< span.&__wrapper
				< span.&__cell.&__pre-icon v-if = preIcon
					< b-icon :value = preIcon
					&nbsp;

				< span.&__cell.&__value
					{{value}}

				< span.&__cell.&__icon v-if = icon
					< b-icon :value = icon

				< span.&__cell.&__progress-bar
					< span.&__icon.&__progress[.fa-spin]
						< b-icon :value = 'cog'
