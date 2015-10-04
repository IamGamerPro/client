/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-block/i-block' as placeholder

- template [%fileName%](params) extends ['i-block']
	- block body
		< span.fa :class = {'fa-spin': spin} | :data-title = title
			{{symbols[value]}}
