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
					< div :class = getElClasses({msg: {own: Boolean(data.emails)}}) | @click = stage='edit'
						{{ data.status || '`Здесь мог бы быть ваш статус`' }}

					< .&__controls
						< .&__control
							< b-icon &
								:value = 'pencil' |
								:title = '`Редактировать`' |
								:mods = baseMods |
								@click = stage='edit'
							.

						< .&__control v-if = data.status
							< b-icon &
								:value = 'remove' |
								:title = '`Удалить`' |
								:mods = baseMods |
								@click = updateStatus({body: {status: ''}})
							.

						< .&__control.&__progress
							< b-progress-icon :mods = assign(baseMods, {size: lt[mods.size]})

				< b-background.&__edit v-if = stage === 'edit' | :block-name = 'status' | :mods = {theme: 'metallic'}
					< b-form :delegate = updateStatus.bind(this)
						< b-input.&__input &
							v-ref:input |
							:name = 'status' |
							:value = data.status |
							:maxlength = 100 |
							:icon = 'save' |
							:mods = {theme: 'dark-form', size: mods.size, width: 'full', disabled: mods.progress}
						.

						< b-button.&__save &
							:type = 'submit' |
							:mods = {theme: 'light-form', size: lt[mods.size], disabled: !testInput(), progress: mods.progress}
						.
							`Сохранить`
