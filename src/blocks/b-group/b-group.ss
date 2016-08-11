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
	- block body
		- super
		- block group
			< .&__title
				< .&__cell.&__title-text
					< slot name = title
						{{ title }}

				< .&__cell.&__toggle v-if = blockStatus[block && block.state] === 'ready'
					< b-icon &
						:value = ifSomeMod(['opened'], true) ? 'caret-up' : 'caret-down' |
						:init-mods = baseMods |
						v-e:click = ifSomeMod(['opened'], true) ? close() : open()
					.

			< .&__content v-if = blockStatus[block && block.state] === 'ready'
				< slot name = body
