'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import iData from '../i-data/i-data';
import * as tpls from './b-avatar.ss';
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

		uploader: {
			type: Object,
			required: true
		},

		changeAvatarEvent: {
			type: String,
			default: 'changeUserAvatar'
		}
	},

	computed: {
		/** @override */
		requestParams(): Object {
			return {get: {id: this.userId}};
		},

		/**
		 * Returns a path to the main avatar
		 */
		avatar(): string {
			return this.hasAvatar ? `https://ucarecdn.com/${this.data.avatar.l}/l` : '';
		}
	},

	methods: {
		/**
		 * Removes the user avatar
		 */
		async removeAvatar() {
			await this.url('avatar').del();
			this.globalEvent.emit(this.changeAvatarEvent, {avatar: {}, thumbRect: {}});
		}
	},

	created() {
		this.$set('hasAvatar', false);
		this.waitState('ready', () => this.hasAvatar = Boolean(this.$get('data.avatar.l')));
	},

	ready() {
		this.globalEvent.on(this.changeAvatarEvent, async ({avatar, thumbRect}) => {
			this.setMod('progress', true);

			await this.async.sleep((2).seconds(), {label: this.changeAvatarEvent});
			avatar = $C(avatar).length() ?
				Object.mixin(false, this.$get('data.avatar'), avatar) : {};

			this.$set('data.avatar', avatar);
			this.$set('data.thumbRect', thumbRect);
			this.hasAvatar = Boolean(this.$get('data.avatar.l'));

			if (this.hasAvatar) {
				const img = new Image();
				img.src = this.avatar;
				await this.async.promise(img.init, {label: this.changeAvatarEvent});
			}

			this.setMod('progress', false);
		});
	}

}, tpls)

@block
export default class bAvatar extends iData {}
