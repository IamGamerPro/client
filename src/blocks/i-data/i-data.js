'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import iMessage from '../i-message/i-message';
import { field, watch, params } from '../i-block/i-block';
import { model } from '../../core/block';
import { providers } from '../../core/data';
import { RequestError } from '../../core/request';
import type { $$requestParams } from '../../core/request';

@model()
export default class iData extends iMessage {
	/**
	 * Data provider name
	 */
	@watch('initLoad')
	dataProvider: ?string;

	/**
	 * Block data
	 */
	@field(null)
	db: ?Object;

	/**
	 * Data provider synchronization
	 */
	@params({immediate: true})
	$$dataProvider(value: ?string) {
		if (value) {
			this.$$dataProvider = new providers[value]();

		} else {
			this.$$dataProvider = null;
		}
	}

	/**
	 * Request parameters
	 */
	get requestParams(): Object {
		return {};
	}

	/** @override */
	async initLoad() {
		this.blockStatus = this.blockStatus.loading;

		if (this.dataProvider) {
			this.db = (await this.get(...this.getParams('get'), {label: 'initLoad'})).response;
		}

		this.blockStatus = this.blockStatus.ready;
	}

	/**
	 * Sets advanced URL for requests OR returns full URL
	 * @param [value]
	 */
	url(value?: string): Vue | string {
		if (!value) {
			return this.$$dataProvider.url(value);
		}

		this.$$dataProvider.url(value);
		return this;
	}

	/**
	 * Sets base temporary URL for requests
	 * @param [value]
	 */
	base(value?: string): Vue {
		this.$$dataProvider.base(value);
		return this;
	}

	/**
	 * Gets data
	 *
	 * @param [data]
	 * @param [params]
	 */
	get(data?: any, params?: $$requestParams & {label?: string, group?: string} = {}): Promise<XMLHttpRequest> {
		const req = this.async.setRequest({
			label: params.label,
			group: params.group,
			req: this.$$dataProvider.get(data, Object.reject(params, 'label', 'group'))
		});

		if (this.mods.progress !== 'true') {
			this.setMod('progress', true);
			const then = () => this.setMod('progress', false);
			req.then(then, (err) => {
				then();
				throw err;
			});
		}

		return req;
	}

	/**
	 * Puts data
	 *
	 * @param data
	 * @param [params]
	 */
	put(data?: any, params?: $$requestParams & {label?: string, group?: string} = {}): Promise<XMLHttpRequest> {
		const req = this.async.setRequest({
			label: params.label,
			group: params.group,
			req: this.$$dataProvider.put(data, Object.reject(params, 'label', 'group'))
		});

		if (this.mods.progress !== 'true') {
			this.setMod('progress', true);
			const then = () => this.setMod('progress', false);
			req.then(then, (err) => {
				then();
				throw err;
			});
		}

		return req;
	}

	/**
	 * Updates data
	 *
	 * @param [data]
	 * @param [params]
	 */
	upd(data?: any, params?: $$requestParams & {label?: string, group?: string} = {}): Promise<XMLHttpRequest> {
		const req = this.async.setRequest({
			label: params.label,
			group: params.group,
			req: this.$$dataProvider.upd(data, Object.reject(params, 'label', 'group'))
		});

		if (this.mods.progress !== 'true') {
			this.setMod('progress', true);
			const then = () => this.setMod('progress', false);
			req.then(then, (err) => {
				then();
				throw err;
			});
		}

		return req;
	}

	/**
	 * Deletes data
	 *
	 * @param [data]
	 * @param [params]
	 */
	del(data?: any, params?: $$requestParams & {label?: string, group?: string} = {}): Promise<XMLHttpRequest> {
		const req = this.async.setRequest({
			label: params.label,
			group: params.group,
			req: this.$$dataProvider.del(data, Object.reject(params, 'label', 'group'))
		});

		if (this.mods.progress !== 'true') {
			this.setMod('progress', true);
			const then = () => this.setMod('progress', false);
			req.then(then, (err) => {
				then();
				throw err;
			});
		}

		return req;
	}

	/**
	 * Returns request parameters for the specified method
	 * @param method
	 */
	getParams(method: string): Array {
		return [].concat(this.requestParams && this.requestParams[method] || []);
	}

	/**
	 * Returns default texts for server errors
	 * @param err
	 */
	getDefaultErrText(err: Error & RequestError): string {
		let msg = i18n`Упс, на сервере что-то упало :(`;

		if (err instanceof RequestError === false || err.type === 'abort') {
			return msg;
		}

		switch (err.type) {
			case 'timeout':
				msg = i18n`Сервер не отвечает, попробуй позже.`;
				break;

			case 'invalidStatus':
				switch (err.code) {
					case 403:
						msg = i18n`Извини, но у тебя нет прав на эту операцию.`;
						break;

					case 404:
						msg = i18n`Запрашиваемый ресурс не найден.`;
						break;
				}

				break;
		}

		return msg;
	}

	/**
	 * Sets an error message for the specified error object
	 * to the component or to the first component of the specified form
	 *
	 * @param err
	 * @param comp
	 */
	setErrorMsgForInput(err: Error, comp: ?Vue) {
		if (!comp) {
			return;
		}

		const
			el = 'elements' in comp ? comp.elements[0] : comp;

		el.setMod('valid', false);
		el.error = this.getDefaultErrText(err);
		el.focus();
	}
}
