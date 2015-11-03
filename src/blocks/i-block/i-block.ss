/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-base/i-base' as placeholder

- template [%fileName%](params) extends ['i-base']
	- block root
		< .i-block-helper.${'' + /\['(.*?)'\]/.exec(TPL_NAME)[1]}

			/**
			 * Wrapper for a progress bar
			 */
			- block progress(content)
				< span.&__icon.&__progress[.fa-spin]
					{content|!html}

			< .&__layer
				< .&__over
					- block over

				- block body

			- block helpers
