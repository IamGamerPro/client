/**
 * Коды клавиш клавиатуры
 * @type {!Object.<number>}
 */
export const KeyCode = Object.setLength({
	ENTER: 13,
	ESC: 27,
	BACKSPACE: 8,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
});

/**
 * Коды клавиш мышки
 * @type {!Object.<number>}
 */
export const MouseButton = Object.setLength({
	LEFT: 0
});

/**
 * События DnD
 * @type {!Object.<string>}
 */
export const DnDEvents = Object.setLength({
	DRAG_START: 'mousedown touchstart',
	DRAG: 'mousemove touchmove',
	DRAG_END: 'mouseup touchend'
});
