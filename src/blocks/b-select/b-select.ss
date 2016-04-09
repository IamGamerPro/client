- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../b-input/' as placeholder

- template index(params) extends ['b-input'].index
	- block icons
		< span.&__cell.&__icon.&__dropdown
			< b-icon :mods = {theme: mods.theme, size: mods.size} | :value = 'caret-down'

	- block helpers
		- super
		- block dropdown
			< span.&__options[.&_hidden_true] v-el:options
				< b-scroll.&__scroll v-ref:scroll | :mods = {theme: mods.theme}
					< span &
						v-for = el of options |
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
