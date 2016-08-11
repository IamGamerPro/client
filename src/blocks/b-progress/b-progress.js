'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iBlock, { field, bindToParam, PARENT } from '../i-block/i-block';
import * as tpls from './b-progress.ss';
import { model } from '../../core/block';

@model(tpls)
export default class bProgress extends iBlock {
	/**
	 * Progress value store
	 */
	@field(0)
	valueStore: number;

	/** @override */
	static mods = {
		@bindToParam('valueStore')
		progress: [
			PARENT
		]
	};

	/**
	 * Progress value
	 */
	get value(): number {
		return this.valueStore;
	}

	/**
	 * Sets a new progress value
	 */
	set value(value: number) {
		(async () => {
			this.valueStore = value;

			if (value === 100) {
				await this.async.sleep(0.8.second(), {label: 'complete'});
				this.valueStore = 0;
				this.emit('complete');

			} else {
				this.async.clearTimeout({label: 'complete'});
			}
		})();
	}
}
