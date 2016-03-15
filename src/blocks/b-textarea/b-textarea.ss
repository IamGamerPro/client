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
	- block input
		< b-scroll.&__scroll v-ref:scroll | :mods = {theme: mods.theme}
			< textarea.&__input &
				v-el:input |
				v-model = value |
				:id = id |
				:name = name |
				:placeholder = placeholder |
				:autofocus = autofocus |
				:maxlength = maxLength |
				${attrs}
			.

		< div v-if = maxLength | :class = getElClasses({ &
			limit: {
				hidden: limit > maxLength / 1.5,
				warning: limit < maxLength / 4
			}
		}) .

			`Осталось символов:` {{limit}}
