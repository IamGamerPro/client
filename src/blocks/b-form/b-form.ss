- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-block/i-block' as placeholder

- template index(params) extends ['i-block'].index
	- block body
		< form.&__${'form'|cache} &
			:id = id |
			:name = name |
			:action = action |
			:method = method |
			@submit.prevent = submit |
			novalidate
		.
			< slot
