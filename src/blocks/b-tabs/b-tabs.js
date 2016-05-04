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
		tabs: {
			type: Object,
			twoWay: true
		}
	},

	methods: {
		onActive(e) {
			e.preventDefault();
			this.active = e.delegateTarget.href;
		}
	},

	created() {
		if (this.tabs) {
			this.$set('tabs.loaded', {});
			this.$set('tabs.active', {});
		}

		this.event.on('el.mod.*.link.active.*', ({link, type, value}) => {
			if (!this.tabs) {
				return;
			}

			const
				hash = link.href && URI(link.href).fragment();

			if (hash) {
				if (type === 'remove' || value === 'false') {
					this.$set(`tabs.active.${hash}`, false);

				} else {
					if (this.$get(`tabs.loaded.${hash}`)) {
						this.$set(`tabs.active.${hash}`, true);

					} else {
						this.block.setElMod(link, 'link', 'progress', true);
						this.async.setTimeout(() => {
							this.$set(`tabs.loaded.${hash}`, true);
							this.$set(`tabs.active.${hash}`, true);
							this.block.setElMod(link, 'link', 'progress', false);
						}, 0.01.second());
					}
				}
			}
		});
	}

}, tpls)

@block
export default class bTabs extends bNavList {}
