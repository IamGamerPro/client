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
		- block avatar
			< .&__controls[.animated]
				< b-pseudo-link.&__control &
					:pre-icon = 'upload' |
					:mods = {theme: 'dark', size: lt[mods.size]} |
					@click = uploader.open()
				.
					{{ data.avatar ? '`Загрузить новый аватар`' : '`Загрузить аватар`' }}

				< b-pseudo-link.&__control &
					v-if = data.avatar |
					:pre-icon = 'camera' |
					:mods = {theme: 'dark', size: lt[mods.size]} |
					@click = uploader.open('editThumbs', 'https://ucarecdn.com/' + data.avatar.l + '/l')
				.
					`Изменить миниатюру`

				< b-pseudo-link.&__control &
					v-if = data.avatar |
					:pre-icon = 'remove' |
					:mods = {theme: 'danger', size: lt[mods.size]}
				.
					`Удалить аватар`

			< img &
				:class = getElClasses({avatar: true}).concat('g-avatar-' + gt[mods.size]) |
				:src = data.avatar ? 'https://ucarecdn.com/' + data.avatar.l + '/l' : ''
			.
