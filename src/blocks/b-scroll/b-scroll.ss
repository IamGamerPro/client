- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- include '../i-block/' as placeholder
: rootTag = 'span'

- template index(params) extends ['i-block'].index
	- block body
		- super
		- block scroll
			< span.&__scroll-wrapper ref = scrollWrapper
				< span.&__scroll
					< span.&__scroller &
						ref = scroller |
						v-e:dnd = {
							onDragStart: onScrollerDragStart,
							onDrag: onScrollerDrag,
							onScrollerDragEnd: onScrollerDragEnd
						}
					.

			< span.&__area ref = area | v-e:scroll = onScroll
				< slot
