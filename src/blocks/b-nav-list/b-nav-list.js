'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iData from '../i-data/i-data';
import * as tpls from './b-nav-list.ss';
import { block, model } from '../../core/block';
import { delegate } from '../../core/dom';

@model({
	props: {
		value: {
			type: Array,
			default: () => []
		},

		active: {
			type: String,
			coerce: (el) => el !== undefined ? String(el) : el
		}
	},

	methods: {
		/**
		 * Returns true if the specified link is active
		 * @param link
		 */
		isActive(link: Object): boolean {
			const a = document.createElement('a');
			a.href = link.href;

			if (link.active && !this.active) {
				this.active = a.href;
			}

			return this.active ? a.href === this.active : link.active;
		},

		onActive(e) {
			this.active = e.delegateTarget.href;
		}
	},

	ready() {
		this.$el.addEventListener('click', delegate(this.block.getElSelector('link'), this.onActive.bind(this)));
	}

}, tpls)

@block
export default class bNavList extends iData {}
