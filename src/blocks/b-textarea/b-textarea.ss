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
	- block input
		< b-scroll.&__scroll ref = scroll | :init-mods = {theme: mods.theme}
			< textarea.&__input &
				ref = input |
				v-model = value |
				:id = id |
				:name = name |
				:form = form |
				:placeholder = placeholder |
				:autofocus = autofocus |
				:maxlength = maxlength |
				v-e:focus = onEditStart |
				v-e:input = onEdit |
				v-e:blur = onEditEnd |
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

				`Осталось символов:` {{ limit }}
