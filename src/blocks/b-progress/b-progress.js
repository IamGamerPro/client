'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock, { PARENT_MODS, bindToParam, $watch } from '../i-block/i-block';
import * as tpls from './b-progress.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		@$watch('complete', {immediate: true})
		value: {
			type: Number,
			default: 0
		}
	},

	mods: {
		@bindToParam('value')
		progress: [
			PARENT_MODS
		]
	},

	methods: {
		async complete() {
			if (this.value === 100) {
				await this.async.sleep({label: 'complete'}, 0.8.second());
				this.value = 0;
				this.emit('complete');

			} else {
				this.async.clearTimeout({label: 'complete'});
			}
		}
	}

}, tpls)

@block
export default class bProgress extends iBlock {}
