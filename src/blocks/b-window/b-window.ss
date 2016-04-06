- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-block/' as placeholder

- template index(params) extends ['i-block'].index
	- block body
		- super
		- block window
			< .&__back
			< .&__wrapper
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
								< b-button :mods = {theme: 'dark-form', size: 'l'} | @click = close :: `Закрыть`
