'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bButton from '../b-button/b-button';
import * as tpls from './b-file.ss';
import { block, model } from '../../core/block';
export class bUploaderError extends Error {}

@model({
	props: {
		test: {
			type: Function
		},

		accept: {
			type: String
		},

		read: {
			type: String,
			default: 'readAsDataURL'
		}
	},

	methods: {
		/**
		 * File change handler
		 * @param e
		 */
		onFileSelected(e: Event) {
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
	},

	ready() {
		const {file, button} = this.$els;
		button.addEventListener('click', () => file.click());
	}

}, tpls)

@block
export default class bFile extends bButton {}
