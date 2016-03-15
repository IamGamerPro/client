'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import $C from 'collection.js';

export function onMaskInput(val) {
	val = val || this.primitiveValue;

	const
		selectionStart = this.lastSelectionStartIndex,
		selectionEnd = this.lastSelectionEndIndex,
		selectionFalse = selectionEnd === selectionStart;

	const
		chunks = val.split('').slice(selectionStart, !selectionFalse ? selectionEnd : chunks.length),
		ph = this.maskPlaceholder;

	let res = val.slice(0, selectionStart);
	let mLength = $C(this.mask.value).reduce((mLength, mask) => {
		if (chunks.length) {
			mLength++;
		}

		if (!RegExp.isRegExp(mask)) {
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
		res += val.slice(selectionEnd, this.mask.value.length);
	}

	if (isVal) {
		return res;
	}

	this.value = res;
	this.async.setImmediate(() => {
		mLength = selectionFalse ? selectionStart + mLength : selectionEnd;
		this.lastSelectionStartIndex = mLength;
		this.lastSelectionEndIndex = mLength;
		this.$els.input.setSelectionRange(mLength, mLength);
	});
}

export function onMaskCursorReady() {
	this.setImmediate({
		fn: () => {
			const { input } = this.$els;
			this.lastSelectionStartIndex = input.selectionStart;
			this.lastSelectionEndIndex = input.selectionEnd;
		},

		label: 'upTimeout'
	});
}

export function onMaskNavigate(e: Event) {
	if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
		return;
	}

	const
		keyboardEvent = e instanceof KeyboardEvent,
		leftKey = e.keyCode === KeyCode.LEFT;

	if (keyboardEvent && !leftKey && e.keyCode !== KeyCode.RIGHT) {
		return;
	}

	var
		mask = this.mask,
		canChange = true,
		mouseEvent = e instanceof MouseEvent;

	if ((mouseEvent && e.button === MouseButton.LEFT) || keyboardEvent) {
		if (mouseEvent && !this.val()) {
			let pos = $C(mask).search({
				filter: (el) => RegExp.isRegExp(el),
				mult: false
			});

			this.$input.selectionStart = pos;
			this.$input.selectionEnd = pos;

		} else {
			let pos;
			let event = () => {
				var input = this.$input;

				if (keyboardEvent) {
					if (input.selectionStart !== input.selectionEnd) {
						pos = leftKey ? input.selectionStart : input.selectionEnd;

					} else {
						pos = leftKey ? input.selectionStart - 1 : input.selectionEnd + 1;
					}

				} else {
					pos = input.selectionStart;
				}

				if (input.selectionEnd === pos || keyboardEvent) {
					while (!RegExp.isRegExp(mask[pos])) {
						if (e.keyCode === KeyCode.LEFT) {
							pos--;

							if (pos <= 0) {
								canChange = false;
								break;
							}

						} else {
							if (RegExp.isRegExp(mask[pos - 1])) {
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
						pos = $C(mask).search({filter: (el) => RegExp.isRegExp(el), mult: false});
						input.setSelectionRange(pos, pos);
					}
				}
			};

			if (keyboardEvent) {
				event();
				e.preventDefault();

			} else {
				this.setImmediate(event);
			}
		}
	}
}

export function onMaskBackspace(e) {
	if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey || e.keyCode !== KeyCode.BACKSPACE) {
		return;
	}

	e.preventDefault();
	var val = this.val();

	var startSelectionStart = this.$input.selectionStart,
		startSelectionEnd = this.$input.selectionEnd;

	var selectionFalse = startSelectionStart === startSelectionEnd,
		mLength = 0;

	var n = startSelectionEnd - startSelectionStart;
	n = n > 0 ? n : 1;

	var ph = this.params['maskPlaceholder'];

	while (n--) {
		let selectionEnd = startSelectionEnd - n - 1,
			i = selectionEnd;

		let maskEl = this.mask[selectionEnd],
			prevMaskEl = '';

		if (!RegExp.isRegExp(maskEl) && selectionFalse) {
			prevMaskEl = maskEl;

			while (!RegExp.isRegExp(this.mask[--i]) && i > -1) {
				prevMaskEl += this.mask[i];
			}

			maskEl = this.mask[i];
		}

		if (RegExp.isRegExp(maskEl)) {
			mLength = selectionEnd - prevMaskEl.length;
			val = (val.substr(0, mLength) + ph + val.substr(mLength + 1, val.length));
		}
	}

	startSelectionStart = selectionFalse ? mLength : startSelectionStart;
	while (!RegExp.isRegExp(this.mask[startSelectionStart])) {
		startSelectionStart++;

		if (startSelectionStart >= this.mask.length) {
			break;
		}
	}

	this.val(val, true);
	this.onEditingStart(e);
	this.onEditing(e);

	this.$input.setSelectionRange(startSelectionStart, startSelectionStart);
}

export function onMaskKeyPress(e) {
	if (e.altKey || e.shiftKey || e.ctrlKey || e.metaKey) {
		return;
	}

	e.preventDefault();
	var val = this.val(),
		mask = this.mask;

	var inputVal = String.fromCharCode(String(e.charCode));

	var startSelectionStart = this.$input.selectionStart,
		startSelectionEnd = this.$input.selectionEnd;

	var insert = true;

	var n = startSelectionEnd - startSelectionStart + 1;
	var ph = this.params['maskPlaceholder'];

	while (n--) {
		let selectionEnd = startSelectionEnd - n,
			i = selectionEnd;

		let maskEl = this.mask[selectionEnd],
			nextMaskEl = '';

		if (insert && !RegExp.isRegExp(maskEl)) {
			nextMaskEl = maskEl;

			while (!RegExp.isRegExp(mask[++i]) && i < mask.length) {
				nextMaskEl += mask[i];
			}

			maskEl = mask[i];
		}

		if (RegExp.isRegExp(maskEl) && (!insert || maskEl.test(inputVal))) {
			let mLength = selectionEnd + nextMaskEl.length;
			val = val.substr(0, mLength) + inputVal + val.substr(mLength + 1, val.length);

			if (insert) {
				mLength++;
				startSelectionStart = mLength;

				insert = false;
				inputVal = ph;
			}
		}
	}

	while (!RegExp.isRegExp(mask[startSelectionStart])) {
		if (RegExp.isRegExp(mask[startSelectionStart - 1])) {
			break;
		}

		startSelectionStart++;
		if (startSelectionStart >= mask.length) {
			break;
		}
	}

	this.val(val, true);
	this.onEditingStart(e);
	this.onEditing(e);

	this.$input.setSelectionRange(startSelectionStart, startSelectionStart);
}
