'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import URI from 'uri';
import bNavList from '../b-nav-list/b-nav-list';
import * as tpls from './b-tabs.ss';
import { block, model } from '../../core/block';

@model({
	props: {
		router: {
			type: Object,
			twoWay: true
		}
	},

	created() {
		this.event.on('el.mod.set.link.active.*', ({link}) => {
			if (!this.parts) {
				return;
			}

			const
				hash = link.href && URI(link.href).fragment();

			if (hash) {
				this.$set(`router.${hash}`, true);
			}
		});
	}

}, tpls)

@block
export default class bTabs extends bNavList {}
