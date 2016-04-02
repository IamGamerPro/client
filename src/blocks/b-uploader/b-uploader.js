'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import bButton from '../b-button/b-button';
import * as tpls from './b-uploader.ss';
import { block, model } from '../../core/block';

@model({
	methods: {
		/**
		 * File change handler
		 * @param e
		 */
		onFileSelected(e: Event) {
			const
				file = e.target.files[0],
				reader = new FileReader();

			reader.onload = this.async.setProxy({
				single: true,
				fn: (e) => this.emit('change', e.target.result)
			});

			reader.readAsDataURL(file);
		}
	}

}, tpls)

@block
export default class bUploader extends bButton {}
