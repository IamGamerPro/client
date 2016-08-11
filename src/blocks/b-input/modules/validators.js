'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import { r } from '../../../core/request';

const
	validator = require('validator-js');

export default {
	/** @this {bInput} */
	userName({msg, skipLength, showMsg = true}): boolean {
		const
			val = this.formValue;

		if (!/^\w*$/.test(val)) {
			if (showMsg) {
				this.error = msg ||
					i18n`Недопустимые символы.<br>Допускаются только символы латинского алфавита, знак подчёркивания и цифры`;
			}

			return false;
		}

		if (!skipLength) {
			const
				min = 4,
				max = 18;

			if (val.length < min) {
				if (showMsg) {
					this.error = msg || i18n`Минимальная длина имени должна быть не менее ${min} символов`;
				}

				return false;
			}

			if (val.length > max) {
				if (showMsg) {
					this.error = msg || i18n`Максимальная длина имени должна быть не более ${max} символов`;
				}

				return false;
			}
		}

		return true;
	},

	/** @this {bInput} */
	userNotExists({msg, own, showMsg = true}): Promise<boolean> {
		if (own !== undefined && own === this.formValue) {
			return true;
		}

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
							req: r('register/v1/user-exists', {value: this.formValue})
						});

						if (result === true && showMsg) {
							this.error = msg || i18n`Данное имя уже занято`;
						}

						resolve(result !== true);

					} catch (err) {
						if (showMsg) {
							this.error = this.getDefaultErrText(err);
						}

						resolve(err.type !== 'abort' ? false : null);
					}
				}

			}, 0.3.second());
		});
	},

	/** @this {bInput} */
	email({msg, showMsg = true}): boolean {
		const
			val = String(this.formValue).trim();

		if (val && !validator.isEmail(val)) {
			if (showMsg) {
				this.error = msg || i18n`Неверный формат почты`;
			}

			return false;
		}

		return true;
	},

	/** @this {bInput} */
	emailNotExists({msg, own, showMsg = true}): Promise<boolean> {
		if (own !== undefined && own === this.formValue) {
			return true;
		}

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
							req: r('register/v1/email-exists', {value: this.formValue})
						});

						if (result === true && showMsg) {
							this.error = msg || i18n`Данная почта уже занята`;
						}

						resolve(result !== true);

					} catch (err) {
						if (showMsg) {
							this.error = this.getDefaultErrText(err);
						}

						resolve(err.type !== 'abort' ? false : null);
					}
				}

			}, 0.3.second());
		});
	},

	/** @this {bInput} */
	password({msg, connected, iConnected, skipLength, showMsg = true}): boolean {
		const
			val = this.formValue;

		if (!/^\w*$/.test(val)) {
			if (showMsg) {
				this.error = msg ||
					i18n`Недопустимые символы.<br>Допускаются только символы латинского алфавита, знак подчёркивания и цифры`;
			}

			return false;
		}

		if (!skipLength) {
			const
				min = 6,
				max = 16;

			if (val.length < min) {
				if (showMsg) {
					this.error = msg || i18n`Минимальная длина пароля должна быть не менее ${min} символов`;
				}

				return false;
			}

			if (val.length > max) {
				if (showMsg) {
					this.error = msg || i18n`Максимальная длина пароля должна быть не более ${max} символов`;
				}

				return false;
			}
		}

		if (iConnected) {
			const
				connectedInput = this.$(iConnected);

			if (connectedInput && connectedInput.formValue) {
				if (connectedInput.formValue === val) {
					if (showMsg) {
						this.error = msg || i18n`Старый и новый пароль совпадают`;
					}

					return false;
				}

				connectedInput.setMod('valid', true);
			}
		}

		if (connected) {
			const
				connectedInput = this.$(connected);

			if (connectedInput && connectedInput.formValue) {
				if (connectedInput.formValue !== val) {
					if (showMsg) {
						this.error = msg || `Пароли не совпадают`;
					}

					return false;
				}

				connectedInput.setMod('valid', true);
			}
		}

		return true;
	}
};
