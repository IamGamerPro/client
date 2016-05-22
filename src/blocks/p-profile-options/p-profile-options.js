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
		 * Deletes one of the user emails
		 *
		 * @param i - email number
		 * @param [input]
		 */
		async deleteEmail(i: number, input?: Vue) {
			const
				email = this.data.emails[i];

			if (email.tmp) {
				this.data.emails.splice(i, 1);
				return;
			}

			try {
				await this.base('private/mail').del({value: email.email});
				this.data.emails.splice(i, 1);

			} catch (err) {
				this.setErrorMsgForInput(err, input);
			}
		},

		/**
		 * Changes the user password
		 *
		 * @param params - request parameters
		 * @param [input] - link to the input component
		 */
		async changePassword(params: Object, input?: Vue) {
			try {
				await this.base('register/v1/change-password').put(params.body);

			} catch (err) {
				this.setErrorMsgForInput(err, input);
			}
		},

		/**
		 * Converter for data.emails
		 * @param emails
		 */
		emailConverter(emails: Array): Array | string {
			return emails.length > 1 ? $C(emails).map(({email}) => email) : emails[0].email;
		},

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
