- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../i-input/' as placeholder

- template index(params) extends ['i-input'].index
	- block body
		- super

		: attrs = {}
		- block attrs() =>

		< span.&__super-wrapper ref = superWrapper | v-e:click = focus
			- block input
				< span.&__wrapper
					< span.&__cell
						< input.&__input &
							ref = input |
							v-model = valueStore |
							:id = id |
							:name = name |
							:form = form |
							:type = type |
							:placeholder = placeholder |
							:autocomplete = autocomplete |
							:autofocus = autofocus |
							:maxlength = maxlength |
							v-e:focus = onEditStart |
							v-e:input = onEdit |
							v-e:blur = onEditEnd |
							${attrs}
						.

					< span.&__cell.&__icon.&__clear
						< b-icon &
							:value = 'remove-sign' |
							:title = '`Очистить`' |
							:init-mods = baseMods |
							v-e:mousedown,touchstart.prevent |
							v-e:click = clear
						.

					- block icons

					< span.&__cell.&__icon.&__progress
						< b-progress-icon :init-mods = baseMods
