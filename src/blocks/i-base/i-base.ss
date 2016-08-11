- namespace [%fileName%]

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

- placeholder index(@params = {})
	/**
	 * Returns the block name
	 */
	- block name()
		- return /\['(.*?)'\]/.exec(TPL_NAME)[1]
