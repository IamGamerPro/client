'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import validator from 'validator';
import { r } from '../../../core/request';
import { SERVER_URL } from '../../../core/const/server';

export default {
	userName({msg, skipLength, showMsg = true}): boolean {
		const
			val = this.formValue;

		if (!/^\w*$/.test(val)) {
			if (showMsg) {
				this.errorMsg = msg || i18n(
					'Недопустимые символы.<br>Допускаются только символы латинского алфавита, знак подчёркивания и цифры'
				);
			}

			return false;
		}

		if (!skipLength) {
			const
				min = 4,
				max = 18;

			if (val.length < min) {
				if (showMsg) {
					this.errorMsg = msg || (
						`${i18n('Минимальная длина имени должна быть не менее')} ${min} ${i18n('символов')}`
					);
				}

				return false;
			}

			if (val.length > max) {
				if (showMsg) {
					this.errorMsg = msg || (
						`${i18n('Максимальная длина имени должна быть не более')} ${max} ${i18n('символов')}`
					);
				}

				return false;
			}
		}

		return true;
	},

	userNotExists({msg, showMsg = true}): Promise<boolean> {
		return new Promise((resolve) => {
			this.async.setTimeout({
				group: 'validation',
				label: 'userExists',
				onClear: () => resolve(false),
				fn: async () => {
					try {
						const {response: {result}} = await this.async.setRequest({
							group: 'validation',
							label: 'userExists',
							req: r(`${SERVER_URL}register/v1/user-exists`, {value: this.formValue})
						});

						if (result === true && showMsg) {
							this.errorMsg = msg || i18n('Данное имя уже занято');
						}

						resolve(result !== true);

					} catch (err) {
						if (showMsg) {
							this.errorMsg = this.getDefaultErrText(err);
						}

						resolve(err.type !== 'abort' ? false : null);
					}
				}

			}, 0.3.second());
		});
	},

	email({msg, showMsg = true}): boolean {
		const
			val = String(this.formValue).trim();

		if (val && !validator.isEmail(val)) {
			if (showMsg) {
				this.errorMsg = msg || i18n('Неверный формат почты');
			}

			return false;
		}

		return true;
	},

	emailNotExists({msg, showMsg = true}): Promise<boolean> {
		return new Promise((resolve) => {
			this.async.setTimeout({
				group: 'validation',
				label: 'emailExists',
				onClear: () => resolve(false),
				fn: async () => {
					try {
						const {response: {result}} = await this.async.setRequest({
							group: 'validation',
							label: 'emailExists',
							req: r(`${SERVER_URL}register/v1/email-exists`, {value: this.formValue})
						});

						if (result === true && showMsg) {
							this.errorMsg = msg || i18n('Данная почта уже занята');
						}

						resolve(result !== true);

					} catch (err) {
						if (showMsg) {
							this.errorMsg = this.getDefaultErrText(err);
						}

						resolve(err.type !== 'abort' ? false : null);
					}
				}

			}, 0.3.second());
		});
	},

	password({msg, connected, skipLength, showMsg = true}): boolean {
		const
			val = this.formValue;

		if (!/^\w*$/.test(val)) {
			if (showMsg) {
				this.errorMsg = msg || i18n(
					'Недопустимые символы.<br>Допускаются только символы латинского алфавита, знак подчёркивания и цифры'
				);
			}

			return false;
		}

		if (!skipLength) {
			const
				min = 6,
				max = 16;

			if (val.length < min) {
				if (showMsg) {
					this.errorMsg = msg || (
						`${i18n('Минимальная длина пароля должна быть не менее')} ${min} ${i18n('символов')}`
					);
				}

				return false;
			}

			if (val.length > max) {
				if (showMsg) {
					this.errorMsg = msg || (
						`${i18n('Максимальная длина пароля должна быть не более')} ${max} ${i18n('символов')}`
					);
				}

				return false;
			}
		}

		if (connected) {
			const
				connectedInput = this.$(connected);

			if (connectedInput && connectedInput.formValue) {
				if (connectedInput.formValue !== val) {
					if (showMsg) {
						this.errorMsg = msg || i18n('Пароли не совпадают');
					}

					return false;
				}

				connectedInput.setMod('valid', true);
			}
		}

		return true;
	}
};
