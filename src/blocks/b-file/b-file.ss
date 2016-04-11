- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../b-button/' as placeholder

- template index(params) extends ['b-button'].index
	- block button
		- super
		< input.&__file v-el:file type = file | :accept = accept | @change = onFileSelected
