/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

- include '../i-base/i-base' as placeholder

- template [%fileName%](params) extends ['i-base']
	- block methods
		: path = require('path')
		- block dependencies(dependencies)
			- forEach addDependencies[path.basename(__filename, '.ess')] => el
				- script js src = ${el}.js
