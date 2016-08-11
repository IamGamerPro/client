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
import * as tpls from './b-link.ss';
import { model } from '../../core/block';

@model(tpls)
export default class bLink extends iData {
	/**
	 * Link href
	 */
	href: string = '#';

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
			'light',
			'light-form',
			'danger'
		],

		underline: [
			['true'],
			'false'
		]
	};
}
