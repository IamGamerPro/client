- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-input/i-input' as placeholder

- template index(params) extends ['i-input'].index
	- block body
		- super
		- block input
			: attrs = {}
			- block attrs() =>
			< span.&__super-wrapper @click = focus
				< span.&__wrapper
					< span.&__cell
						< input.&__${'input'|cache} ( &
							v-model = value |
							:id = id |
							:name = name |
							:type = type |
							:placeholder = placeholder |
							:autocomplete = autocomplete |
							:autofocus = autofocus |
							@focus = onEditingStart |
							@input = onEditingStart(), onEditing() |
							@blur = onEditingEnd |
							${attrs}
						) .

					< span.&__cell.&__icon.&__clear
						< b-icon &
							:value = 'remove-sign' |
							:title = '`Очистить`' |
							@mousedown.prevent |
							@touchstart.prevent |
							@click = clear
						.

					- block icons

					< span.&__cell.&__icon.&__progress
						< b-progress-icon :mods = {size: mods.size, theme: mods.theme}
