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
			< div v-show = tabs.active.standard
				< b-form
					< fieldset
						< legend
							`Аккаунт`

						< table
							< tr
								< td
									< label for = opt-name
										`Ник`

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
										{{ i === 0 ? '`Почта`' : '`Дополнительная почта`' + i + 1 }}

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

				< b-form
					< fieldset
						< legend
							`Смена пароля`

						< table
							< tr
								< td
									< b-input &
										:name = 'currentPwd' |
										:type = 'password' |
										:placeholder = '`Старый пароль`' |
										:validators = ['password'] |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

								< td rowspan = 3
									< p.&__desc
										`Убедитесь, что не включена кнопка CAPS-Lock<br />
										Пароль должен быть не менее 4-х и не более 20-ти символов в длину<br />
										Ещё лучше - использовать и буквы, и цифры<br />
										'kNOpKA' и 'knopka' - разные пароли<br />
										В пароле нельзя использовать кириллические и пробельные символы)`

							< tr
								< td
									< b-input &
										:id = 'opt-pass' |
										:name = 'newPwd' |
										:type = 'password' |
										:placeholder = '`Новый пароль`' |
										:validators = [{password: {connected: '#opt-pass-conf'}}] |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

							< tr
								< td
									< b-input &
										:id = 'opt-pass-conf' |
										:type = 'password' |
										:placeholder = '`Ещё разок`' |
										:validators = [{password: {connected: '#opt-pass', skipLength: true}}] |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

						< b-button &
							:type = 'submit' |
							:pre-icon = 'save' |
							:mods = {theme: 'dark-pseudo-link', size: 's', disabled: true}
						.
							`Сохранить`

				< b-form
					< fieldset
						< legend
							`Общая информация`

						< table
							< tr
								< td
									`Язык`

								< td
									`Часовой пояс`

							< tr
								< td
									< b-select &
										:options = [
											{value: 'ru', label: 'Русский', selected: true},
											{value: 'en', label: 'Английский'}
										] |

										:mods = {theme: 'dark-form'}
									.

								< td
									< b-select &
										:name = 'timezone' |
										:value = data.timezone |

										:options = [
											{
												value: -12,
												label: '(GMT -12:00) ' + '`Эневеток, Кваджалейн`'
											},
											{
												value: -11,
												label: '(GMT -11:00) ' + '`Остров Мидуэй, Самоа`'
											},
											{
												value: -10,
												label: '(GMT -10:00) ' + '`Гавайи`'
											},
											{
												value: -9,
												label: '(GMT -9:00) ' + '`Аляска`'
											},
											{
												value: -8,
												label: '(GMT -8:00) ' + '`Тихоокеанское время (США и Канада), Тихуана`'
											},
											{
												value: -7,
												label: '(GMT -7:00) ' + '`Горное время (США и Канада), Аризона`'
											},
											{
												value: -6,
												label: '(GMT -6:00) ' + '`Центральное время (США и Канада), Мехико`'
											},
											{
												value: -5,
												label: '(GMT -5:00) ' + '`Восточное время (США и Канада), Богота, Лима`'
											},
											{
												value: -4,
												label: '(GMT -4:00) ' + '`Атлантическое время (Канада), Каракас, Ла Пас`'
											},
											{
												value: -3.5,
												label: '(GMT -3:30) ' + '`Ньюфаундленд`'
											},
											{
												value: -3,
												label: '(GMT -3:00) ' + '`Бразилия, Буэнос-Айрес, Джорджтаун`'
											},
											{
												value: -2,
												label: '(GMT -2:00) ' + '`Среднеатлантическое время`'
											},
											{
												value: -1,
												label: '(GMT -1:00) ' + '`Азорские острова, острова Зелёного Мыса`'
											},
											{
												value: 0,
												label: '(GMT) ' + '`Дублин, Лондон, Лиссабон, Касабланка, Эдинбург`',
												selected: true
											},
											{
												value: 1,
												label: '(GMT +1:00) ' + '`Брюсель, Копенгаген, Мадрид, Париж, Берлин`'
											},
											{
												value: 2,
												label: '(GMT +2:00) ' + '`Афины, Киев, Минск, Бухарест, Рига, Таллин`'
											},
											{
												value: 3,
												label: '(GMT +3:00) ' + '`Москва, Санкт-Петербург, Волгоград`'
											},
											{
												value: 3.5,
												label: '(GMT +3:30) ' + '`Тегеран`'
											},
											{
												value: 4,
												label: '(GMT +4:00) ' + '`Абу-Даби, Баку, Тбилиси, Ереван`'
											},
											{
												value: 4.5,
												label: '(GMT +4:30) ' + '`Кабул`'
											},
											{
												value: 5,
												label: '(GMT +5:00) ' + '`Екатеринбург, Исламабад, Карачи, Ташкент`'
											},
											{
												value: 5.5,
												label: '(GMT +5:30) ' + '`Бомбей, Калькутта, Мадрас, Нью-Дели`'
											},
											{
												value: 6,
												label: '(GMT +6:00) ' + '`Омск, Новосибирск, Алма-Ата, Астана`'
											},
											{
												value: 7,
												label: '(GMT +7:00) ' + '`Красноярск, Норильск, Бангкок, Ханой, Джакарта`'
											},
											{
												value: 8,
												label: '(GMT +8:00) ' + '`Иркутск, Пекин, Перт, Сингапур, Гонконг`'
											},
											{
												value: 9,
												label: '(GMT +9:00) ' + '`Якутск, Токио, Сеул, Осака, Саппоро`'
											},
											{
												value: 9.5,
												label: '(GMT +9:30) ' + '`Аделаида, Дарвин`'
											},
											{
												value: 10,
												label: '(GMT +10:00) ' + '`Владивосток, Восточная Австралия, Гуам`'
											},
											{
												value: 11,
												label: '(GMT +11:00) ' + '`Магадан, Сахалин, Соломоновы Острова`'
											},
											{
												value: 12,
												label: '(GMT +12:00) ' + '`Камчатка, Окленд, Уэллингтон, Фиджи`'
											}
										] |

										:mods = {theme: 'dark-form'}
									.

						< b-button &
							:type = 'submit' |
							:pre-icon = 'save' |
							:mods = {theme: 'dark-pseudo-link', size: 's', disabled: true}
						.
							`Сохранить`

			< div v-show = tabs.active.private
				private

			< div v-show = tabs.active.profile
				< b-form
					< fieldset
						< table
							< tr
								< td
									`Имя`

								< td
									`Фамилия`

							< tr
								< td
									< b-input &
										:name = 'firstName' |
										:value = data.firstName |
										:maxlength = 45 |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

								< td
									< b-input &
										:name = 'lastName' |
										:value = data.lastName |
										:maxlength = 45 |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

							< tr
								< td
									`Страна`

								< td
									`Город`

							< tr
								< td
									< b-input &
										:name = 'country' |
										:value = data.country |
										:maxlength = 45 |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

								< td
									< b-input &
										:name = 'hometown' |
										:value = data.hometown |
										:maxlength = 45 |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

							< tr
								< td
									`Пол`

							< tr
								< td
									< b-select &
										:name = 'sex' |
										:selected = data.sex |

										:options = [
											{value: 0, label: 'Не определился', selected: true},
											{value: 1, label: 'Мужик'},
											{value: 2, label: 'Девушка'}
										] |

										:mods = {theme: 'dark-form'}
									.

							< tr
								< td
									`День`

								< td
									`Месяц`

								< td
									`Год`

							< tr
								< td
									< b-select &
										:name = 'db' |
										:selected = data.db |

										:options = [
										] |

										:mods = {theme: 'dark-form'}
									.

								< td
									< b-select &
										:name = 'dm' |
										:selected = data.dm |

										:options = [
										] |

										:mods = {theme: 'dark-form'}
									.

								< td
									< b-select &
										:name = 'dy' |
										:selected = data.dy |

										:options = [
										] |

										:mods = {theme: 'dark-form'}
									.

							< tr
								< td
									`Любимые игры`

							< tr
								< td
									< b-textarea &
										:name = 'favoriteGames' |
										:value = data.favoriteGames |
										:maxLength = 200 |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

							< tr
								< td
									`Любимая музыка`

							< tr
								< td
									< b-textarea &
										:name = 'favoriteMusic' |
										:value = data.favoriteMusic |
										:maxLength = 200 |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.

							< tr
								< td
									`О себе`

							< tr
								< td
									< b-textarea &
										:name = 'aboutMe' |
										:value = data.aboutMe |
										:maxLength = 200 |
										:mods = {theme: 'dark-form', rounding: 'small'}
									.
