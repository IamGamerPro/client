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
		- block editor
			< .&__super-wrapper
				< b-crop.&__crop &
					v-ref:crop |
					v-if = tools.crop |
					:src = src |
					:width = width |
					:height = height |
					:alt = alt |
					:min-width = tools.crop.minWidth |
					:min-height = tools.crop.minHeight |
					:click-width = tools.crop.clickWidth |
					:click-height = tools.crop.clickHeight |
					:ratio = tools.crop.ratio |
					:ratably = tools.crop.ratio |
					:free-select = tools.crop.freeSelect |
					:select-by-click = tools.crop.freeSelect |
					:resize-select = tools.crop.resizeSelect |
					:move-select = tools.crop.moveSelect |
					:dispatching = true |
					:mods = baseMods
				.

				< img.&__img v-el:img | v-else | :src = src | :width = width | :height = height | :alt = alt

				< .&__wrapper
					< .&__info-cell.&__progress
						< b-progress v-ref:progress

				< .&__controls
					< .&__control v-if = tools.rotate.left | @click = rotate('left')
						< b-icon :value = 'rotate-left' | :mods = baseMods

					< .&__control v-if = tools.rotate.right  | @click = rotate('right')
						< b-icon :value = 'rotate-right' | :mods = baseMods
