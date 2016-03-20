'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import bInput from '../b-input/b-input';
import * as tpls from './b-select.ss';
import { block, model } from '../../core/block';
import { mod } from '../i-base/i-base';

@model({
	props: {
		options: {
			type: Array,
			coerce: (val) => $C(val || []).map((el) => {
				if (el.value !== undefined) {
					el.value = String(el.value);
				}

				el.label = String(el.label);
				return el;
			})
		},

		selected: {
			type: String,
			coerce: (el) => el !== undefined ? String(el) : el
		}
	},

	mods: {
		linkMode: [
			'true',
			['false']
		]
	},

	watch: {
		options: {
			immediate: true,
			handler(val) {
				this._labels = $C(val).reduce((map, el) => (map[el.label] = el, map), {});
				this._values = $C(val).reduce((map, el) => (map[this.getOptionValue(el)] = el, map), {});
			}
		},

		selected: {
			handler(val) {
				if (val === undefined) {
					return;
				}

				val = this._values[val];

				if (val) {
					this.value = val.label;

				} else {
					this.value = '';
					this.selected = undefined;
				}
			}
		}
	},

	methods: {
		/**
		 * Returns a value of the specified option
		 * @param option
		 */
		getOptionValue(option: Object): string {
			return option.value !== undefined ? option.value : option.label;
		},

		/**
		 * Returns true if the specified option is selected
		 * @param option
		 */
		isSelected(option: Object): boolean {
			const
				hasVal = this.selected !== undefined,
				val = this.getOptionValue(option);

			if (!hasVal && option.selected) {
				this.value = option.label;
				this.selected = val;
			}

			return hasVal ? val === this.formValue : option.selected;
		},

		/**
		 * Opens select
		 */
		open() {
			this.block.setElMod(this.$els.options, 'options', 'hidden', false);
			this.$emit('open');
		},

		/**
		 * Closes select
		 */
		close() {
			this.block.setElMod(this.$els.options, 'options', 'hidden', true);
			this.$emit('close');
		}
	},

	computed: {
		formValue() {
			return this.selected;
		}
	},

	created() {
		if (this.selected === undefined && this.value) {
			const
				option = this._labels[this.value];

			if (option) {
				this.selected = this.getOptionValue(option);
			}

		} else if (this.selected !== undefined && !this.value) {
			const val = this._values[this.selected];
			this.value = val ? val.label : '';
		}
	},

	ready() {
		this.event.on('block.mod.set.focused.*', ({value}) => {
			if (value === 'true') {
				this.open();

			} else {
				this.close();
			}
		});
	}

}, tpls)

@block
export default class bSelect extends bInput {}
