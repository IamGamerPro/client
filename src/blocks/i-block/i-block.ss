- namespace [%fileName%]

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-base/i-base' as placeholder

- template index(params) extends ['i-base'].index
	- block root
		< .i-block-helper.${/\['(.*?)'\]/.exec(TPL_NAME)[1]}

			/**
			 * Wrapper for a progress bar
			 * @param content
			 */
			- block progress(content)
				< span.&__icon.&__progress[.fa-spin]
					{content|!html}

			< .&__root-wrapper
				< .&__over
					- block over

				- block body

			- block helpers
