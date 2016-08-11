'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iBlock, { field, bindToParam } from '../i-block/i-block';
import { model } from '../../core/block';

@model()
export default class iMessage extends iBlock {
	/**
	 * Initial information message
	 */
	initInfo: ?string;

	/**
	 * Initial error message
	 */
	initError: ?string;

	/**
	 * Information message store
	 */
	@field((o) => o.initInfo)
	infoMsg: ?string;

	/**
	 * Error message store
	 */
	@field((o) => o.initError)
	errorMsg: ?string;

	/** @override */
	static mods = {
		@bindToParam('infoMsg')
		showInfo: [
			'true',
			['false']
		],

		@bindToParam('errorMsg')
		showError: [
			'true',
			['false']
		]
	};

	/**
	 * Information message
	 */
	get info(): string {
		return this.infoMsg;
	}

	/**
	 * Sets a new information message
	 */
	set info(value: string) {
		return this.infoMsg = value;
	}

	/**
	 * Error message
	 */
	get error(): string {
		return this.errorMsg;
	}

	/**
	 * Sets a new error message
	 */
	set error(value: string) {
		return this.errorMsg = value;
	}
}
