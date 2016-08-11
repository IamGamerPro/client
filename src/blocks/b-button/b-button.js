'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import { PARENT } from '../i-block/i-block';
import * as tpls from './b-button.ss';
import { model } from '../../core/block';

@model(tpls)
export default class bButton extends iData {
	/**
	 * Button type
	 */
	type: string = 'button';

	/**
	 * Connected form id
	 */
	form: ?string;

	/**
	 * Icon before text
	 */
	preIcon: ?string;

	/**
	 * Icon after text
	 */
	icon: ?string;

	/**
	 * Tooltip text
	 */
	title: ?string;

	/** @override */
	static mods = {
		theme: [
			PARENT,
			'dark',
			'dark-form',
			'dark-link',
			'dark-pseudo-link',
			'link',
			'pseudo-link'
		]
	};
}
