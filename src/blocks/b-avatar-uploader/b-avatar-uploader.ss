- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../b-window/' as placeholder

- template index(params) extends ['b-window'].index
	- block content
		< div v-if = stage === 'select'
			< p.&__desc
				`Друзьям будет проще узнать тебя, если ты загрузишь свою настоящуюю фотку.`
				< br
				`Ты можешь загрузить изображение в формате JPG, GIF или PNG.`

			< .&__action
				< b-uploader :mods = {theme: 'light-form', size: 'l'} | :accept = accept | @set = setImage | @error = onError
					Выбрать файл

			< p.&__desc
				`Если у тебя возникают проблемы с загрузкой, попробуй выбрать аватар меньшего размера.`

		< div v-if = stage === 'error'
			< p.&__desc
				{{ errorMsg }}

		< div v-if = stage === 'editor'
			< b-image-editor.&__editor &
				v-ref:original |
				:src = original |
				@image.init = $refs.next.enable() |
				@image.error = onError
			.

		< div v-if = {thumbs: true, editThumbs: true}[stage]
			< p.&__desc v-if = stage === 'thumbs'
				`Осталось выбрать квадратную область для маленьких аватаров.`
				< br
				`Выбранная миниатюра будет использоваться в личных сообщениях, комментариях и т.д.`

			< b-image-editor.&__editor &
				v-ref:avatar |
				@image.init = initThumbs() |
				@image.error = onError |
				@b-crop.move = updateThumbs |
				@b-crop.resize = updateThumbs |
				@b-crop.select-end = updateThumbs |
				@b-crop.select-by-click = updateThumbs |
				:src = avatar |
				:skip-test = true |
				:max-width = 200 |
				:smooth = 2 |
				:tools = {
					crop: {
						minWidth: 110,
						maxWidth: false,
						minHeight: 110,
						maxHeight: false,
						ratably: true,
						ratio: [1, 1]
					},

					rotate: {
						left: false,
						right: false
					}
				}
			.

			< .&__thumbs v-el:thumbs
				< .&__thumb[.g-avatar-m]
				< .&__thumb[.g-avatar-s]
				< .&__thumb[.g-avatar-xs]
				< .&__thumb[.g-avatar-xxs]

	- block controls
		< div v-if = stage === 'select'
			< b-button :mods = {theme: 'dark-form', size: 'l'} | @click = close
				`Закрыть`

		< div v-if = stage === 'error'
			< b-button :mods = {theme: 'dark-form', size: 'l'} | @click = prev
				`Попробывать ещё раз`

		< div v-if = {editor: true, thumbs: true}[stage]
			< b-button.&__btn &
				v-ref:next |
				:mods = {theme: 'light-form', size: 'l', disabled: true} |
				@click = next
			.
				`Сохранить и продолжить`

			< b-button.&__btn :mods = {theme: 'dark-form', size: 'l'} | @click = prev
				`Вернуться назад`
