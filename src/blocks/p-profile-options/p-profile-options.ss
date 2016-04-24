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
				standard

			< div v-if = tabs.loaded.private | v-show = tabs.active.private
				private

			< div v-if = tabs.loaded.profile | v-show = tabs.active.profile
				profile
