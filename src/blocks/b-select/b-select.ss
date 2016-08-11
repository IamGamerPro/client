- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../b-input/' as placeholder

- template index(params) extends ['b-input'].index
	- block icons
		< span.&__cell.&__icon.&__dropdown
			< b-icon :value = 'caret-down' | :init-mods = baseMods

	- block helpers
		- super
		- block dropdown
			< span.&__options[.&_hidden_true] ref = options
				< b-scroll.&__scroll ref = scroll | :init-mods = {theme: mods.theme}
					< span &
						v-for = el in options |
						:data-value = getOptionValue(el) |
						:class = getElClasses({
							option: {
								marked: el.marked,
								selected: isSelected(el)
							}
						})
					.

						< span.&__option-tpl v-if = option
							< component :is = option | :option = el

						< span.&__option-tpl v-else
							{{ el.label }}
