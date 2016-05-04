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
import bInput from '../b-input/b-input';
import * as tpls from './b-select.ss';
import { mod, wait } from '../i-block/i-block';
import { block, model } from '../../core/block';
import { delegate } from '../../core/dom';

@model({
	props: {
		options: {
			type: Array,
			coerce: (val) => $C(val || []).map((el) => {
				if (el.value !== undefined) {
					el.value = String(el.value);
				}

				el.label = String(el.label);
				return el;
			})
		},

		selected: {
			type: String,
			coerce: (el) => el !== undefined ? String(el) : el
		}
	},

	mods: {
		linkMode: [
			'true',
			['false']
		]
	},

	watch: {
		options: {
			immediate: true,
			handler(val) {
				if (this.$refs.scroll) {
					this.$refs.scroll.initScrollHeight();
				}

				this._labels = $C(val).reduce((map, el) => {
					el.value = this.getOptionValue(el);
					map[el.label] = el;
					return map;

				}, {});

				this._values = $C(val).reduce((map, el) => {
					el.value = this.getOptionValue(el);
					map[el.value] = el;
					return map;

				}, {});
			}
		},

		selected: {
			immediate: true,
			handler(val) {
				if (val === undefined || !this._values) {
					return;
				}

				val = this._values[val];

				if (val) {
					if (this.block.getMod('focused') !== 'true') {
						this.value = val.label;
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

				} else {
					this.value = '';
					this.selected = undefined;
				}
			}
		}
	},

	computed: {
		/** @override */
		formValue() {
			return this.dataType(this.selected);
		}
	},

	methods: {
		/** @override */
		clear() {
			this.close();
			this.selected = undefined;
			this.value = undefined;
		},

		/**
		 * Returns a value of the specified option
		 * @param option
		 */
		getOptionValue(option: Object): string {
			return option.value !== undefined ? option.value : option.label;
		},

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
		},

		/**
		 * Returns true if the specified option is selected
		 * @param option
		 */
		isSelected(option: Object): boolean {
			const
				val = this.getOptionValue(option);

			if (option.selected && !this.selected) {
				if (!this.block || this.block.getMod('focused') !== 'true') {
					this.value = option.label;
				}

				this.selected = val;
			}

			return this.selected ? val === this.formValue : option.selected;
		},

		/**
		 * Opens select
		 */
		@mod('focused', true)
		@wait('ready')
		open() {
			if (this.block.setElMod(this.$els.options, 'options', 'hidden', false)) {
				const selected = this.$el.query(this.block.getElSelector('option', ['selected', true]));
				this.$refs.scroll.setScrollOffset({top: selected ? selected.offsetTop : 0});
				this.emit('open');
			}
		},

		/**
		 * Closes select
		 */
		@wait('ready')
		close() {
			if (this.block.setElMod(this.$els.options, 'options', 'hidden', true)) {
				this.emit('close');
			}
		},

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
	},

	created() {
		const
			{async: $a, event: $e} = this;

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
					if (e.keyCode === KeyCodes.ESC) {
						e.preventDefault();
						reset();
					}
				}
			});

			$a.addNodeEventListener(document, 'keypress', {
				group: 'navigation',
				fn: (e) => {
					if (!{[KeyCodes.UP]: true, [KeyCodes.DOWN]: true, [KeyCodes.ENTER]: true}[e.keyCode]) {
						return;
					}

					e.preventDefault();

					const
						{block: $b} = this,
						selected = $el.query($b.getElSelector('option', ['selected', true]));

					switch (e.keyCode) {
						case KeyCodes.ENTER:
							if (selected) {
								this.syncValue();
								this.close();
							}

							break;

						case KeyCodes.UP:
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

						case KeyCodes.DOWN: {
							const select = (el) => {
								if (el) {
									if ($b.getElMod(this.$els.options, 'options', 'hidden') === 'true') {
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
				if (this.block.getMod('focused') === 'false') {
					$a.removeNodeEventListener({group: 'navigation'});
				}
			});

			$e.on('block.mod.set.focused.false', () => {
				if (this.block.getElMod(this.$els.options, 'options', 'hidden') === 'true') {
					$a.removeNodeEventListener({group: 'navigation'});
				}
			});
		});
	},

	ready() {
		this.$el.addEventListener('click', delegate(this.block.getElSelector('option'), (e) => {
			this.syncValue(e.delegateTarget.dataset['value']);
			this.close();
		}));
	}

}, tpls)

@block
export default class bSelect extends bInput {}
