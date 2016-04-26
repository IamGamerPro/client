- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../p-profile/' as placeholder

- template index(params) extends ['p-profile'].index
	- block mainColumn
		< b-title :user-id = data._id.$oid | :desc = '`настройки аккаунта`'
		< b-tabs :tabs.sync = tabs | :value = [ &
			{text: '`Общее`', href: '#standard', active: true},
			{text: '`Приватность`', href: '#private'},
			{text: '`Личная страница`', href: '#profile'}
		] .
			< div v-if = tabs.loaded.standard | v-show = tabs.active.standard
				< b-form
					< fieldset
						< legend
							`Аккаунт`

						< table
							< tr
								< td
									< label for = opt-name
										`Ник:`

								< td
									< b-input &
										:id = 'opt-name' |
										:name = 'name' |
										:value = data.login |
										:validators = ['userName', 'userNotExists'] |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

							< tr v-for = (i, el) in data.emails
								< td
									< label :for = 'opt-email-' + i
										{{ i === 0 ? '`Почта`' : '`Дополнительная почта`' + i + 1 }}:

								< td
									< b-input &
										:id = 'opt-email-' + i |
										:name = 'emails' |
										:value = el.mail |
										:validators = ['email', 'emailNotExists'] |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

						< b-button &
							:type = 'submit' |
							:pre-icon = 'save' |
							:mods = {theme: 'dark-pseudo-link', size: 's', disabled: true}
						.
							`Сохранить`


			< div v-if = tabs.loaded.private | v-show = tabs.active.private
				private

			< div v-if = tabs.loaded.profile | v-show = tabs.active.profile
				profile
