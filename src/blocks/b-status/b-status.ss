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
		< .&__data-wrapper v-if = data
			- block status
				< .&__view v-if = stage === 'view'
					< span.&__msg[.&_own_true] @click = stage='edit'
						{{ data.status || '`Здесь мог бы быть ваш статус`' }}

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
								:mods = baseMods |
								@click = updateStatus({body: {status: ''}})
							.

				< b-background.&__edit v-if = stage === 'edit' | :mods = {theme: 'metallic'}
					< b-form :delegate = updateStatus.bind(this) | method = 'PUT'
						< b-input.&__input &
							v-ref:input |
							:value = data.status |
							:icon = 'save' |
							:mods = {theme: 'dark-form', size: mods.size, width: 'full'} |
							:name = 'status' |
							@mod.set.empty.true = $refs.save.setMod('disabled', true) |
							@input = $refs.save.setMod('disabled', !testInput())
						.

						< .&__controls
							< b-button &
								v-ref:save |
								:type = 'submit' |
								:mods = {theme: 'light-form', size: lt[mods.size], disabled: true}
							.
								`Сохранить`
