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

						< .&__r[.&__hor-align_left.&__vert-align_top]
						< .&__r[.&__hor-align_left.&__vert-align_bottom]
						< .&__r[.&__hor-align_right.&__vert-align_top]
						< .&__r[.&__hor-align_right.&__vert-align_bottom]

						< .&__r[.&__hor-align_left.&__vert-align_middle] v-if = ratably
						< .&__r[.&__hor-align_right.&__vert-align_middle] v-if = ratably
						< .&__r[.&__hor-align_middle.&__vert-align_top] v-if = ratably
						< .&__r[.&__hor-align_middle.&__vert-align_bottom] v-if = ratably

					< .&__clone v-el:clone

				< .&__original v-el:original
					< slot v-el:img
