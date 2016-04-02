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
			- block crop
				< .&__area v-el:area
					< .&__select v-el:select

						< .&__r[.&_hor-align_left.&_vert-align_top] v-el:r
						< .&__r[.&_hor-align_left.&_vert-align_bottom]
						< .&__r[.&_hor-align_right.&_vert-align_top]
						< .&__r[.&_hor-align_right.&_vert-align_bottom]

						< .&__r[.&_hor-align_left.&_vert-align_middle] v-if = ratably
						< .&__r[.&_hor-align_right.&_vert-align_middle] v-if = ratably
						< .&__r[.&_hor-align_middle.&_vert-align_top] v-if = ratably
						< .&__r[.&_hor-align_middle.&_vert-align_bottom] v-if = ratably

					< .&__clone v-el:clone

				< .&__original v-el:original
					< img v-el:img | :src = src | alt =
