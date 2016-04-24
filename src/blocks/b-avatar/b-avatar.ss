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
		- block progress
			< .&__progress
				< b-progress-icon

		< .&__data-wrapper v-if = data
			- block avatar
				< .&__controls[.animated]
					< b-pseudo-link.&__control &
						:pre-icon = 'upload' |
						:mods = {theme: 'dark', size: lt[mods.size]} |
						@click = uploader.open()
					.
						{{ data.avatar ? '`Загрузить новый аватар`' : '`Загрузить аватар`' }}

					< b-pseudo-link.&__control &
						v-if = hasAvatar |
						:pre-icon = 'camera' |
						:mods = {theme: 'dark', size: lt[mods.size]} |
						@click = uploader.open('editThumbs', avatar)
					.
						`Изменить миниатюру`

					< b-pseudo-link.&__control &
						v-if = hasAvatar |
						:pre-icon = 'remove' |
						:mods = {theme: 'danger', size: lt[mods.size]} |
						@click = removeAvatar
					.
						`Удалить аватар`

				< img &
					:class = getElClasses({avatar: {empty: !hasAvatar}}).concat('g-avatar-' + gt[mods.size]) |
					:src = hasAvatar ? avatar : '${@images}empty-avatar.svg'
				.
