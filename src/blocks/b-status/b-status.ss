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
			< .&__view v-if = stage === 'view'
				< span.&__msg[.&_own_true] @click = stage='edit'
					`Здесь мог бы быть ваш статус`

				< .&__controls
					< .&__control
						< b-icon &
							:value = 'pencil' |
							:title = '`Редактировать`' |
							:mods = baseMods |
							@click = stage='edit'
						.

					< .&__control
						< b-icon &
							:value = 'remove' |
							:title = '`Удалить`' |
							:mods = baseMods
						.

			< b-background.&__edit v-if = stage === 'edit' | :mods = {theme: 'metallic'}
				< b-form
					< b-input.&__input &
						:icon = 'save' |
						:mods = {theme: 'dark-form', size: mods.size, width: 'full'} |
						:name = 'status'
					.

					< .&__controls
						< b-button :type = 'submit' | :mods = {theme: 'light-form', size: lt[mods.size], disabled: true}
							`Сохранить`
