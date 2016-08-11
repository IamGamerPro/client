'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-icon.ss';
import { model } from '../../core/block';

@model(tpls)
export default class bIcon extends iBlock {
	/**
	 * Block value
	 */
	value: string;

	/**
	 * Tooltip text
	 */
	title: ?string;

	/**
	 * Spin mode
	 */
	spin: boolean = false;

	/**
	 * Available icons
	 */
	static symbols = {
		'desktop': '',
		'search': '',
		'envelope': '',
		'envelope-o': '',
		'comment-o': '',
		'comments-o': '',
		'camera': '',
		'film': '',
		'picture': '',
		'upload': '',
		'user': '',
		'heart': '',
		'check': '',
		'remove-sign': '',
		'remove': '',
		'thumb-up': '',
		'thumb-down': '',
		'pencil': '',
		'save': '',
		'hand-o-up': '',
		'cog': '',
		'cogs': '',
		'spinner': '',
		'sun': '',
		'time': '',
		'refresh': '',
		'sort': '',
		'sort-up': '',
		'sort-down': '',
		'undo': '',
		'caret-up': '',
		'caret-down': '',
		'rotate-left': '',
		'rotate-right': '',
		'close': '',
		'plus': '',
		'minus': ''
	}
}
