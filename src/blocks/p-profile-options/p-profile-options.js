'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import pProfile from '../p-profile/p-profile';
import * as tpls from './p-profile-options.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		tabs: {
			type: Object,
			default: () => ({})
		},

		emails: {
			type: Array,
			default: () => []
		}
	},

	methods: {
		/**
		 * Returns b-select values with days for the specified month
		 * @param month
		 */
		getDaysInMonth(month?: number): Array<Object> {
			const days = [
				31,
				29,
				31,
				30,
				31,
				30,
				31,
				31,
				30,
				31,
				30,
				31
			];

			return $C(new Array(days[month] || 30)).map((el, i) => ({
				value: i + 1,
				label: i + 1
			}));
		},

		/**
		 * Returns b-select values with last 100 years
		 */
		getYears(): Array<Object> {
			const year = new Date().getFullYear();
			return $C(new Array(100)).map((el, i) => ({
				value: year - i,
				label: year - i
			}));
		}
	}

}, tpls)

@block
export default class pProfileOptions extends pProfile {}
