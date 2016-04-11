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
		- block status
			< .&__view
				< span.&__msg[.&_own_true]
					`Здесь мог бы быть ваш статус`

				< span.&__controls
					< span.&__control
						< b-icon &
							:value = 'pencil' |
							:title = '`Редактировать`' |
							:mods = baseMods
						.

					< span.&__control
						< b-icon &
							:value = 'remove' |
							:title = '`Удалить`' |
							:mods = baseMods
						.

			< b-background.&__edit-place :mods = {theme: 'metallic'}
				< b-form
					< b-input.&__input &
						:mods = {theme: 'dark-form'} |
						:name = 'status'

					< .&__controls
						< b-button :type = 'submit'
							`Сохранить`
