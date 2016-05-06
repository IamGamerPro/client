'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';
import KeyCodes from 'js-keycodes';

export default {
	/**
	 * Updates the mask value
	 */
	updateMask() {
		const
			{async: $a, mask, maskPlaceholder} = this,
			{input} = this.$els;

		if (mask) {
			$a.addNodeEventListener(input, 'mousedown keydown', {
				group: 'mask',
				fn: (e) => this.onMaskNavigate(e)
			});

			$a.addNodeEventListener(input, 'mouseup keyup', {
				group: 'mask',
				fn: () => this.onMaskCursorReady()
			});

			$a.addNodeEventListener(input, 'keypress', {
				group: 'mask',
				fn: (e) => this.onMaskKeyPress(e)
			});

			$a.addNodeEventListener(input, 'keydown', {
				group: 'mask',
				fn: (e) => this.onMaskBackspace(e)
			});

			$a.addNodeEventListener(input, 'input', {
				group: 'mask',
				fn: () => this.applyMaskToValue()
			});

			$a.addNodeEventListener(input, 'focus', {
				group: 'mask',
				fn: () => this.onMaskFocus()
			});

			$a.addNodeEventListener(input, 'blur', {
				group: 'mask',
				fn: () => this.onMaskBlur()
			});

		} else {
			$a.removeNodeEventListener({group: 'mask'});
		}

		const
			value = [];

		let
			tpl = '',
			sys = false;

		$C(mask).forEach((el) => {
			if (el === '%') {
				sys = true;
				return;
			}

			tpl += sys ? maskPlaceholder : el;

			if (sys) {
				value.push(new RegExp(`\\${el}`));
				sys = false;

			} else {
				value.push(el);
			}
		});

		this._mask = {value, tpl};
		if (mask && this.value) {
			this.applyMaskToValue();
		}
	},

	/**
	 * Applies the mask to the block value
	 * @param [value]
	 */
	applyMaskToValue(value?: string) {
		const isVal = value !== undefined;
		value = value || this.value;

		this.lastSelectionStartIndex = this.lastSelectionStartIndex || 0;
		this.lastSelectionEndIndex = this.lastSelectionEndIndex || 0;

		const
			mask = this._mask.value;

		const
			selectionStart = this.lastSelectionStartIndex,
			selectionEnd = this.lastSelectionEndIndex,
			selectionFalse = selectionEnd === selectionStart;

		const
			chunks = value.split('').slice(selectionStart, !selectionFalse ? selectionEnd : undefined),
			ph = this.maskPlaceholder;

		let res = value.slice(0, selectionStart);
		let mLength = $C(mask).reduce((mLength, mask) => {
			if (chunks.length) {
				mLength++;
			}

			if (!Object.isRegExp(mask)) {
				res += mask;

			} else {
				if (chunks.length) {
					while (chunks.length && !mask.test(chunks[0])) {
						chunks.shift();
					}

					if (chunks.length && mask.test(chunks[0])) {
						res += chunks[0];
						chunks.shift();

					} else {
						res += ph;
					}

				} else {
					res += ph;
				}
			}

			return mLength;

		}, -1, {
			endIndex: !selectionFalse ? selectionEnd - 1 : null,
			startIndex: selectionStart
		});

		if (!selectionFalse) {
			res += value.slice(selectionEnd, mask.length);
		}

		this.value =
			this.$els.input.value = res;

		if (!isVal) {
			this.async.setImmediate({
				fn: () => {
					mLength = selectionFalse ? selectionStart + mLength : selectionEnd;
					this.lastSelectionStartIndex = mLength;
					this.lastSelectionEndIndex = mLength;
					this.$els.input.setSelectionRange(mLength, mLength);
				},

				label: 'applyMaskToValue'
			});
		}
	},

	/**
	 * Caches cursor position
	 */
	onMaskCursorReady() {
		this.async.setImmediate({
			fn: () => {
				const {input} = this.$els;
				this.lastSelectionStartIndex = input.selectionStart;
				this.lastSelectionEndIndex = input.selectionEnd;
			},

			label: 'onMaskCursorReady'
		});
	},

	/**
	 * Focus logic for the mask
	 */
	onMaskFocus() {
		const
			{input} = this.$els,
			mask = this._mask;

		if (this.mods.empty === 'true') {
			let pos = $C(mask.value).search({
				filter: (el) => Object.isRegExp(el),
				mult: false
			});

			this.value = input.value = mask.tpl;
			input.setSelectionRange(pos, pos);
		}
	},

	/**
	 * Blur logic for the mask
	 */
	onMaskBlur() {
		if (this.value === this._mask.tpl) {
			this.value = undefined;
		}
	},

	/**
	 * Backspace logic for the mask
	 * @param e
	 */
	onMaskBackspace(e: Event) {
		const codes = {
			[KeyCodes.BACKSPACE]: true,
			[KeyCodes.DELETE]: true
		};

		if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey || !codes[e.keyCode]) {
			return;
		}

		e.preventDefault();

		const
			{input} = this.$els;

		let
			startSelectionStart = input.selectionStart,
			startSelectionEnd = input.selectionEnd;

		const
			selectionFalse = startSelectionStart === startSelectionEnd,
			mask = this._mask.value,
			ph = this.maskPlaceholder;

		let
			val = this.value,
			mLength = 0;

		if (e.keyCode === KeyCodes.DELETE && selectionFalse) {
			const tmp = val.split('');
			tmp.splice(startSelectionStart, 1);
			this.applyMaskToValue(tmp.join(''));
			input.setSelectionRange(startSelectionStart, startSelectionStart);
			return;
		}

		let n = startSelectionEnd - startSelectionStart;
		n = n > 0 ? n : 1;

		while (n--) {
			const
				selectionEnd = startSelectionEnd - n - 1;

			let
				maskEl = mask[selectionEnd],
				prevMaskEl = '',
				i = selectionEnd;

			if (!Object.isRegExp(maskEl) && selectionFalse) {
				prevMaskEl = maskEl;

				while (!Object.isRegExp(mask[--i]) && i > -1) {
					prevMaskEl += mask[i];
				}

				maskEl = mask[i];
			}

			if (Object.isRegExp(maskEl)) {
				mLength = selectionEnd - prevMaskEl.length;
				val = val.substr(0, mLength) + ph + val.slice(mLength + 1);
			}
		}

		startSelectionStart = selectionFalse ?
			mLength : startSelectionStart;

		while (!Object.isRegExp(mask[startSelectionStart])) {
			startSelectionStart++;
			if (startSelectionStart >= mask.length) {
				break;
			}
		}

		this.value = input.value = val;
		input.setSelectionRange(startSelectionStart, startSelectionStart);
	},

	/**
	 * Navigation by arrows for the mask
	 * @param e
	 */
	onMaskNavigate(e: Event) {
		if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
			return;
		}

		const
			keyboardEvent = e instanceof KeyboardEvent,
			leftKey = e.keyCode === KeyCodes.LEFT;

		if (keyboardEvent && !leftKey && e.keyCode !== KeyCodes.RIGHT) {
			return;
		}

		const
			{input} = this.$els;

		const
			mask = this._mask.value,
			mouseEvent = e instanceof MouseEvent;

		let canChange = true;
		if ((mouseEvent && e.button === 0) || keyboardEvent) {
			if (mouseEvent && !this.value) {
				const pos = $C(mask).search({
					filter: (el) => Object.isRegExp(el),
					mult: false
				});

				input.selectionStart = pos;
				input.selectionEnd = pos;

			} else {
				let pos;
				const event = () => {
					const
						{selectionStart, selectionEnd} = input;

					if (keyboardEvent) {
						if (selectionStart !== selectionEnd) {
							pos = leftKey ? selectionStart : selectionEnd;

						} else {
							pos = leftKey ? selectionStart - 1 : selectionEnd + 1;
						}

					} else {
						pos = selectionStart;
					}

					if (selectionEnd === pos || keyboardEvent) {
						while (!Object.isRegExp(mask[pos])) {
							if (leftKey) {
								pos--;

								if (pos <= 0) {
									canChange = false;
									break;
								}

							} else {
								if (Object.isRegExp(mask[pos - 1])) {
									break;
								}

								pos++;
								if (pos >= mask.length) {
									canChange = false;
									break;
								}
							}
						}

						if (canChange) {
							input.setSelectionRange(pos, pos);

						} else {
							pos = $C(mask).search({filter: (el) => Object.isRegExp(el), mult: false});
							input.setSelectionRange(pos, pos);
						}
					}
				};

				if (keyboardEvent) {
					event();
					e.preventDefault();

				} else {
					this.async.setImmediate({fn: event, label: 'onMaskNavigate'});
				}
			}
		}
	},

	/**
	 * Input logic for the mask
	 * @param e
	 */
	onMaskKeyPress(e: Event) {
		if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
			return;
		}

		e.preventDefault();

		const
			{input} = this.$els;

		const
			mask = this._mask.value,
			ph = this.maskPlaceholder;

		let
			val = this.value,
			inputVal = String.fromCharCode(String(e.charCode));

		let
			startSelectionStart = input.selectionStart,
			startSelectionEnd = input.selectionEnd;

		let
			insert = true,
			n = startSelectionEnd - startSelectionStart + 1;

		while (n--) {
			const
				selectionEnd = startSelectionEnd - n;

			let
				maskEl = mask[selectionEnd],
				nextMaskEl = '',
				i = selectionEnd;

			if (insert && !Object.isRegExp(maskEl)) {
				nextMaskEl = maskEl;

				while (!Object.isRegExp(mask[++i]) && i < mask.length) {
					nextMaskEl += mask[i];
				}

				maskEl = mask[i];
			}

			if (Object.isRegExp(maskEl) && (!insert || maskEl.test(inputVal))) {
				let mLength = selectionEnd + nextMaskEl.length;
				val = val.substr(0, mLength) + inputVal + val.slice(mLength + 1);

				if (insert) {
					mLength++;
					startSelectionStart = mLength;
					insert = false;
					inputVal = ph;
				}
			}
		}

		while (!Object.isRegExp(mask[startSelectionStart])) {
			if (Object.isRegExp(mask[startSelectionStart - 1])) {
				break;
			}

			startSelectionStart++;
			if (startSelectionStart >= mask.length) {
				break;
			}
		}

		input.value = this.value = val;
		input.setSelectionRange(startSelectionStart, startSelectionStart);
	}
};
