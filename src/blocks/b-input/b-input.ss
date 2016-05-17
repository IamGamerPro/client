- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-input/' as placeholder

- template index(params) extends ['i-input'].index
	- block body
		- super

		: attrs = {}
		- block attrs() =>

		< span.&__super-wrapper v-el:super-wrapper | @click = focus
			- block input
				< span.&__wrapper
					< span.&__cell
						< input.&__input &
							v-el:input |
							v-model = value |
							:value = value |
							:id = id |
							:name = name |
							:form = form |
							:type = type |
							:placeholder = placeholder |
							:autocomplete = autocomplete |
							:autofocus = autofocus |
							:maxlength = maxlength |
							@focus = onEditStart |
							@input = onEdit |
							@blur = onEditEnd |
							${attrs}
						.

					< span.&__cell.&__icon.&__clear
						< b-icon &
							:value = 'remove-sign' |
							:title = '`Очистить`' |
							:mods = baseMods |
							@mousedown.prevent |
							@touchstart.prevent |
							@click = clear
						.

					- block icons

					< span.&__cell.&__icon.&__progress
						< b-progress-icon :mods = baseMods
