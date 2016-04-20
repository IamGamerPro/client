'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import KeyCodes from 'js-keycodes';
import iData from '../i-data/i-data';
import * as tpls from './b-status.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		userId: {
			type: String
		},

		dataProvider: {
			type: String,
			default: 'user'
		},

		stage: {
			type: String,
			default: 'view'
		}
	},

	watch: {
		stage: {
			immediate: true,
			handler(value) {
				this.errorMsg = '';

				const
					{async: $a} = this;

				switch (value) {
					case 'edit':
						$a.addNodeEventListener(document, 'click keyup', {
							group: 'global',
							fn: (e) => {
								if (e.keyCode === KeyCodes.ESC || !e.target.closest(`.${this.blockId}`)) {
									this.stage = 'view';
								}
							}
						});

						break;

					case 'view':
						$a.removeNodeEventListener({group: 'global'});
						break;
				}
			}
		}
	},

	computed: {
		/** @override */
		requestParams(): Object {
			return {get: {id: this.userId}};
		}
	},

	methods: {
		/**
		 * Returns true if the inputted status value is valid
		 */
		testInput(): boolean {
			const val = this.$refs.input.formValue.trim();
			return Boolean(val && val !== this.data.status);
		},

		/**
		 * Updates user status
		 * @param params - request parameters
		 */
		async updateStatus(params) {
			this.setMod('progress', true);
			try {
				await this.async.setRequest({
					label: 'update',
					req: this.$$dataProvider.upd(params.body, params)
				});

				if (this.stage === 'edit') {
					this.stage = 'view';
				}

				this.data.status = params.body.status;

			} catch (err) {
				this.errorMsg = this.getDefaultErrText(err);
			}

			this.setMod('progress', false);
		}
	}

}, tpls)

@block
export default class bStatus extends iData {}
