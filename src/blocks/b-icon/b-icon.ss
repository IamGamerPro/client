- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- template index(@params = {})
	- block icon
		< span.fa :class = {'fa-spin': spin} | :data-title = title
			{{ $options.symbols[value] }}
