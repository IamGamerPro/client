- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-block/i-block' as placeholder

- template index(params) extends ['i-block'].index
	- block body
		- super
		- block scroll
			< .&__scroll-wrapper
				< .&__scroll
					< .&__scroller

			< .&__area
				< slot
