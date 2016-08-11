'use strict';

/*!
 * TravelChat Client
 * https://github.com/kobezzza/TravelChat
 *
 * Released under the FSFUL license
 * https://github.com/kobezzza/TravelChat/blob/master/LICENSE
 */

import bInput from '../b-input/b-input';
import * as tpls from './b-select.ss';
import keyCodes from '../../core/keyCodes';
import { field, params, mod, wait } from '../i-block/i-block';
import { model } from '../../core/block';
import { delegate } from '../../core/dom';

const
	$C = require('collection.js');

@model(tpls)
export default class bSelect extends bInput {
	/**
	 * Initial select options
	 */
	initOptions: Array<Object> = [];

	/**
	 * Initial selected value
	 */
	initSelected: ?any;

	/**
	 * Option component
	 */
	option: ?string;

	/**
	 * Select options store
	 */
	@field((o) => o.initOptions)
	optionsStore: Array<Object>;

	/**
	 * Selected value store
	 */
	@field((o) => o.initSelected)
	selectedStore: any;

	/** @override */
	$refs(): {scroll: bScroll, options: Element, input: HTMLInputElement} {}

	/** @override */
	static mods = {
		linkMode: [
			'true',
			['false']
		]
	};

	/**
	 * Options synchronization
	 */
	@params({immediate: true})
	$$optionsStore(value) {
		if (this.$refs.scroll) {
			this.$refs.scroll.initScrollHeight();
		}

		this._labels = $C(value).reduce((map, el) => {
			el.value = this.getOptionValue(el);
			map[el.label] = el;
			return map;
		}, {});

		this._values = $C(value).reduce((map, el) => {
			el.value = this.getOptionValue(el);
			map[el.value] = el;
			return map;
		}, {});

		const
			selected = this._values[this.selected];

		if (selected) {
			this.value = selected.label;
		}
	}

	/**
	 * Selected value synchronization
	 */
	@params({immediate: true})
	$$selectedStore(value) {
		if (value === undefined || !this._values) {
			return;
		}

		value = this._values[value];

		if (!value) {
			return;
		}

		if (this.mods.focused !== 'true') {
			this.value = value.label;
		}

		const
			selected = this.$el.query(this.block.getElSelector('option', ['selected', true])),
			{scroll} = this.$refs;

		if (selected) {
			const
				selTop = selected.offsetTop,
				selHeight = selected.offsetHeight,
				selOffset = selTop + selHeight;

			const
				scrollHeight = scroll.getHeight(),
				scrollTop = scroll.getScrollOffset().top;

			if (selOffset > scrollHeight) {
				if (selOffset > scrollTop + scrollHeight) {
					scroll.setScrollOffset({top: selTop - scrollHeight + selHeight});

				} else if (selOffset < scrollTop + selected.offsetHeight) {
					scroll.setScrollOffset({top: selTop});
				}

			} else if (selOffset < scrollTop) {
				scroll.setScrollOffset({top: selTop});
			}
		}
	}

	/**
	 * Select options
	 */
	get options(): Array<Object> {
		return $C(this.optionsStore).map((el) => {
			if (el.value !== undefined) {
				el.value = String(el.value);
			}

			el.label = String(el.label);
			return el;
		});
	}

	/**
	 * Sets new select options
	 */
	set options(value: Array<Object>) {
		this.optionsStore = value;
	}

	/**
	 * Selected value
	 */
	get selected(): ?string {
		const val = this.selectedStore;
		return val !== undefined ? String(val) : val;
	}

	/**
	 * Sets a new selected value
	 */
	set selected(value: ?string) {
		this.selectedStore = value;
	}

	/** @override */
	get formValue() {
		return this.dataType(this.selected);
	}

	/** @override */
	@wait('ready')
	clear() {
		this.close();
		this.selected = undefined;
		this.value = undefined;
	}

	/**
	 * Returns a value of the specified option
	 * @param option
	 */
	getOptionValue(option: Object): string {
		return this.dataType(option.value !== undefined ? option.value : option.label);
	}

	/**
	 * Synchronizes :selected and :value
	 * @param [selected]
	 */
	syncValue(selected?: string) {
		if (selected) {
			this.selected = selected;
		}

		const
			el = this._values[this.selected];

		if (el) {
			this.value = el.label;
		}
	}

	/**
	 * Returns true if the specified option is selected
	 * @param option
	 */
	isSelected(option: Object): boolean {
		const
			val = this.getOptionValue(option);

		if (option.selected && !this.selected && !this.value) {
			if (this.mods.focused !== 'true') {
				this.value = option.label;
			}

			this.selected = val;
		}

		return this.selected || this.value ? val === this.formValue : option.selected;
	}

	/**
	 * Opens select
	 */
	@mod('focused', true)
	@wait('loading')
	open() {
		if (this.block.setElMod(this.$refs.options, 'options', 'hidden', false)) {
			const selected = this.$el.query(this.block.getElSelector('option', ['selected', true]));
			this.$refs.scroll.setScrollOffset({top: selected ? selected.offsetTop : 0});
			this.emit('open');
		}
	}

	/**
	 * Closes select
	 */
	@wait('loading')
	close() {
		if (this.block.setElMod(this.$refs.options, 'options', 'hidden', true)) {
			this.emit('close');
		}
	}

	/**
	 * Editing
	 */
	onEdit() {
		this.async.setTimeout({
			label: 'quickSearch',
			fn: () => {
				const
					rgxp = new RegExp(`^${this.value.escapeRegExp()}`, 'i');

				if (
					$C(this._labels).some((el, key) => {
						if (rgxp.test(key)) {
							this.selected = el.value;
							return true;
						}
					})

				) {
					this.open();

				} else {
					this.selected = undefined;
					this.close();
				}
			}

		}, 0.2.second());
	}

	/** @override */
	created() {
		const
			{async: $a, local: $e} = this;

		if (this.selected === undefined && this.value) {
			const
				option = this._labels[this.value];

			if (option) {
				this.selected = option.value;
			}

		} else if (this.selected !== undefined && !this.value) {
			const val = this._values[this.selected];
			this.value = val ? val.label : '';
		}

		$e.on('el.mod.set.options.hidden.false', () => {
			$a.removeNodeEventListener({group: 'navigation'});

			const
				{$el, selected} = this;

			const reset = () => {
				if (selected) {
					this.syncValue(selected);
				}

				this.close();
			};

			$a.addNodeEventListener(document, 'click', {
				group: 'global',
				fn: (e) => {
					if (!e.target.closest(`.${this.blockId}`)) {
						reset();
					}
				}
			});

			$a.addNodeEventListener(document, 'keyup', {
				group: 'global',
				fn: (e) => {
					if (e.keyCode === keyCodes.ESC) {
						e.preventDefault();
						reset();
					}
				}
			});

			$a.addNodeEventListener(document, 'keypress', {
				group: 'navigation',
				fn: (e) => {
					if (!{[keyCodes.UP]: true, [keyCodes.DOWN]: true, [keyCodes.ENTER]: true}[e.keyCode]) {
						return;
					}

					e.preventDefault();

					const
						{block: $b} = this;

					const
						selected = $el.query($b.getElSelector('option', ['selected', true]));

					switch (e.keyCode) {
						case keyCodes.ENTER:
							if (selected) {
								this.syncValue();
								this.close();
							}

							break;

						case keyCodes.UP:
							if (this.selected) {
								if (selected) {
									if (selected.previousElementSibling) {
										this.selected = selected.previousElementSibling.dataset.value;
										break;
									}

									this.close();
								}
							}

							break;

						case keyCodes.DOWN: {
							const select = (el) => {
								if (el) {
									if ($b.getElMod(this.$refs.options, 'options', 'hidden') === 'true') {
										this.open();
										if (this.selected) {
											return;
										}
									}

									if (!this.selected) {
										this.selected = el.dataset.value;
										return;
									}

									if (el.nextElementSibling) {
										this.selected = el.nextElementSibling.dataset.value;
										return;
									}

									this.selected = $el.query($b.getElSelector('option')).dataset.value;
								}
							};

							if (this.selected) {
								if (selected) {
									select(selected);
									break;
								}
							}

							select($el.query($b.getElSelector('option')));
							break;
						}
					}
				}
			});
		});

		$e.once(`block.state.ready`, () => {
			$e.on('el.mod.set.options.hidden.true', () => {
				$a.removeNodeEventListener({group: 'global'});
				if (this.mods.focused === 'false') {
					$a.removeNodeEventListener({group: 'navigation'});
				}
			});

			$e.on('block.mod.set.focused.false', () => {
				if (this.block.getElMod(this.$refs.options, 'options', 'hidden') === 'true') {
					$a.removeNodeEventListener({group: 'navigation'});
				}
			});
		});
	}

	/** @override */
	mounted() {
		this.$el.addEventListener('click', delegate(this.block.getElSelector('option'), (e) => {
			this.syncValue(e.delegateTarget.dataset.value);
			this.close();
		}));
	}
}
