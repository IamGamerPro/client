'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import bButton from '../b-button/b-button';
import * as tpls from './b-file.ss';
import { model } from '../../core/block';
export class bUploaderError extends Error {}

@model(tpls)
export default class bFile extends bButton {
	/**
	 * Test function
	 */
	test: ?Function;

	/**
	 * Accept string
	 */
	accept: ?string;

	/**
	 * Read type
	 */
	read: string = 'readAsDataURL';

	/** @override */
	$refs(): {file: HTMLInputElement, button: HTMLButtonElement} {}

	/**
	 * File change handler
	 * @param e
	 */
	onFileSelected(e: InputEvent) {
		const
			file = e.target.files[0],
			reader = new FileReader();

		if (this.test && !this.test(file)) {
			this.emit('error', new bUploaderError('TEST_FAIL'));
			return;
		}

		reader.onload = this.async.setProxy((e) => this.emit('set', e.target.result));
		reader[this.read](file);
	}

	/** @override */
	mounted() {
		const {file, button} = this.$refs;
		button.addEventListener('click', () => file.click());
	}
}
