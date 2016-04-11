- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-dynamic-page/' as placeholder

- template index(params) extends ['i-dynamic-page'].index
	- block root
		< ${@tag}.${self.name()}
			< b-avatar-uploader v-ref:avatar-uploader

			- block page
				< .&__cell-p4
					< b-avatar :uploader = $refs.avatarUploader

				< .&__cell-p16
					< b-title
