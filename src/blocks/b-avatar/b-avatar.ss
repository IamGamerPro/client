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
					:mods = {theme: 'dark', size: 's'} |
					:pre-icon = 'upload' |
					@click = uploader.open()
				.
					`Загрузить аватар`

				< b-pseudo-link.&__control :mods = {theme: 'dark', size: 's'} | :pre-icon = 'camera'
					`Изменить миниатюру`

				< b-pseudo-link.&__control :mods = {theme: 'danger', size: 's'} | :pre-icon = 'remove'
					`Удалить аватар`

			< img &
				:class = getElClasses({avatar: true}).concat('g-avatar-' + $options.sizeTo.gt[mods.size]) |
				:src = '../../img/avatars/1.png'
			.
