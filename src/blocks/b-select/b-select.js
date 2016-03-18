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

@model({
	props: {
		options: {
			type: Array,
			default: () => []
		}
	},

	watch: {
		options: {
			immediate: true,
			handler(val) {
				this._options = new Map($C(val).map((el) => [el.label, el]));
			}
		}
	},

	methods: {
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
			const val = this._options.get(this.value);
			return val && val.value !== undefined ? val.value : val;
		}
	}

}, tpls)

@block
export default class bSelect extends bInput {}
