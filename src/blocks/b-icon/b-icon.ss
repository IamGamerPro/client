/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- template [%fileName%](params)
	- block body
		< span.fa :class = {'fa-spin': spin} | :data-title = title
			{{$options.symbols[value]}}
