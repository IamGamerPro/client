- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-block/' as placeholder

- template index(params) extends ['i-block'].index
	- block body
		< form.&__form &
			v-el:form |
			:id = id |
			:name = name |
			:action = action |
			@submit.prevent = submit |
			novalidate
		.
			< slot
