- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-data/' as placeholder

- template index(params) extends ['i-data'].index
	- block body
		- super
			< .&__wrapper
				- block list
					< .&__el v-for = el in value
						< a &
							:class = getElClasses({link: {
								active: el.active,
								marked: el.marked,
								hidden: el.hidden,
								progress: el.progress
							}}) |
							:href = el.href |
							:data-title = el.title
						.
							< .&__cell.&__pre-icon v-if = preIcon
								< b-icon :value = preIcon | :mods = baseMods

							< .&__cell.&__text
								{{ el.text }}

							< .&__cell.&__info v-if = el.info
								{{ el.info }}

							< .&__cell.&__icon v-if = icon
								< b-icon :value = icon | :mods = baseMods

							< .&__cell.&__icon.&__link-progress
								< b-progress-icon :mods = baseMods
