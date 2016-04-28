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
	- block input
		< b-scroll.&__scroll v-ref:scroll | :mods = {theme: mods.theme}
			< textarea.&__input &
				v-el:input |
				v-model = value |
				:id = id |
				:name = name |
				:placeholder = placeholder |
				:autofocus = autofocus |
				:maxlength = maxlength |
				@focus = onEditStart |
				@input = onEdit |
				@blur = onEditEnd |
				${attrs}
			.

	- block helpers
		- super
		- block limit
			< span v-if = maxlength | :class = getElClasses({ &
				limit: {
					hidden: limit > maxlength / 1.5,
					warning: limit < maxlength / 4
				}
			}) .

				`Осталось символов:` {{limit}}
