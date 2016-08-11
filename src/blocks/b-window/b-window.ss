- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../i-data/' as placeholder

- template index(params) extends ['i-data'].index
	- block message
	- block body
		- super
		- block window
			< .&__back
			< .&__wrapper v-if = mods.hidden !== 'true'
				< section.&__window
					< h1.&__title
						- block title
							< slot name = title
								{{ title }}

					< .&__content
						- block content
							< slot name = body

					< .&__controls
						- block controls
							< slot name = control
								< b-button &
									:init-mods = {theme: 'dark-form', size: gt[mods.size]} |
									v-e:click = close
								.
									`Закрыть`
