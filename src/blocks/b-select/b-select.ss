- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../b-input/b-input' as placeholder

- template index(params) extends ['b-input'].index
	- block attrs()
		? attrs[':options'] = 'options'

	- block helpers
		- block dropdown
			< .&__options[.&_hidden_true] v-el:options
				< b-scroll.&__scroll v-ref:scroll | :mods = {theme: mods.theme}
					< div &
						v-for = el of options |
						:value = el.value |
						:class = getElClasses({
							option: {
								selected: el.selected,
								default: el.default
							}
						})
					.

						< .&__option-tpl v-if = option
							< component :is = option | :option = el

						< .&__option-tpl v-else
							{{ el.label }}
