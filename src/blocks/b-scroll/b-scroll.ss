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
			< .&__scroll-wrapper v-el:scroll-wrapper
				< .&__scroll
					< .&__scroller &
						v-el:scroller |
						:dnd-init = dnd($els.scroller, {
							onDragStart: onScrollerDragStart,
							onDrag: onScrollerDrag,
							onScrollerDragEnd: onScrollerDragEnd
						})
					.

			< .&__area v-el:area | @scroll = onScroll
				< slot
