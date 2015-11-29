/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-data/i-data' as placeholder

- template [%fileName%](params) extends ['i-data']
	- block body
		- super
		- block input
			< span.&__super-wrapper
				< span.&__wrapper
					< span.&__cell
						< input.&__input &
							:id = id |
							:name = name |
							:type = type |
							:placeholder = placeholder |
							:autocomplete = autocomplete |
							:autofocus = autofocus |
							:value = value
						.

					< span.&__cell.&__icon.&__progress-bar
						- wrap callBlock progress()
							< b-icon :value = 'cog'

					< span.&__cell.&__icon.&__clear
						< b-icon :value = 'cog' | title = `Очистить`

					- block icons
