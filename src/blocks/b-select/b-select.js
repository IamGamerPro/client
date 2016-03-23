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
import { block, model, status } from '../../core/block';
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
				this._labels = $C(val).reduce((map, el) => (map[el.label] = el, map), {});
				this._values = $C(val).reduce((map, el) => (map[this.getOptionValue(el)] = el, map), {});
			}
		},

		selected: {
			immediate: true,
			handler(val) {
				if (val === undefined) {
					return;
				}

				val = this._values[val];

				if (val) {
					if (this.block.getMod('focused') === 'false') {
						this.value = val.label;
					}

					const
						selected = this.$el.query(this.block.getElSelector('option', ['selected', true])),
						{scroll} = this.$refs;

					if (selected) {
						const
							offset = selected.offsetTop + selected.offsetHeight,
							top = scroll.getScrollOffset().top;

						if (offset > scroll.getHeight()) {
							scroll.setScrollOffset({top: top + selected.offsetHeight});

						} else if (offset < top) {
							scroll.setScrollOffset({top: selected.offsetTop});
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
			return this.selected;
		}
	},

	methods: {
		/**
		 * Returns a value of the specified option
		 * @param option
		 */
		getOptionValue(option: Object): string {
			return option.value !== undefined ? option.value : option.label;
		},

		/**
		 * Returns true if the specified option is selected
		 * @param option
		 */
		isSelected(option: Object): boolean {
			const
				hasVal = this.selected !== undefined,
				val = this.getOptionValue(option);

			if (!hasVal && option.selected) {
				this.value = option.label;
				this.selected = val;
			}

			return hasVal ? val === this.formValue : option.selected;
		},

		/**
		 * Opens select
		 */
		@mod('focused', true)
		@wait(status.ready)
		open() {
			if (this.block.setElMod(this.$els.options, 'options', 'hidden', false)) {
				this.$emit(`${this.$options.name}-open`);

				const
					selected = this.$el.query(this.block.getElSelector('option', ['selected', true]));

				this.$refs.scroll.setScrollOffset({top: selected ? selected.offsetTop : 0});
			}
		},

		/**
		 * Closes select
		 */
		@wait(status.ready)
		close() {
			if (this.block.setElMod(this.$els.options, 'options', 'hidden', true)) {
				this.$emit(`${this.$options.name}-close`);
			}
		},

		/**
		 * Editing
		 */
		onEdit() {
			this.async.setTimeout({
				label: 'quickSearch',
				fn: () => {
				}

			}, 0.2.second());
		}
	},

	created() {
		if (this.selected === undefined && this.value) {
			const
				option = this._labels[this.value];

			if (option) {
				this.selected = this.getOptionValue(option);
			}

		} else if (this.selected !== undefined && !this.value) {
			const val = this._values[this.selected];
			this.value = val ? val.label : '';
		}

		this.event.on('el.mod.set.options.hidden.false', () => {
			this.async
				.removeNodeEventListener({group: 'navigation'});

			const
				{$el, block, selected} = this;

			this.async.addNodeEventListener(document, 'click', {
				group: 'global',
				fn: (e) => {
					if (!e.target.currentOrClosest(`.${this.blockId}`)) {
						this.selected = selected;
						this.close();
					}
				}
			});

			this.async.addNodeEventListener(document, 'keyup', {
				group: 'global',
				fn: (e) => {
					if (e.keyCode === KeyCodes.ESC) {
						e.preventDefault();
						this.selected = selected;
						this.close();
					}
				}
			});

			this.async.addNodeEventListener(document, 'keypress', {
				group: 'navigation',
				fn: (e) => {
					if (!{[KeyCodes.UP]: true, [KeyCodes.DOWN]: true, [KeyCodes.ENTER]: true}[e.keyCode]) {
						return;
					}

					e.preventDefault();

					const
						selected = $el.query(block.getElSelector('option', ['selected', true]));

					switch (e.keyCode) {
						case KeyCodes.ENTER:
							if (selected) {
								this.value = this.selected;
								this.close();
							}

							break;

						case KeyCodes.UP:
							if (this.selected) {
								if (selected) {
									if (selected.previousElementSibling) {
										this.selected = selected.previousElementSibling.dataset['value'];
										break;
									}

									this.close();
								}
							}

							break;

						case KeyCodes.DOWN: {
							const select = (el) => {
								if (el) {
									if (block.getElMod(this.$els.options, 'options', 'hidden') === 'true') {
										this.open();
										return;
									}

									if (el.nextElementSibling) {
										this.selected = el.nextElementSibling.dataset['value'];
										return;
									}

									this.selected = $el.query(block.getElSelector('option')).dataset['value'];
								}
							};

							if (this.selected) {
								if (selected) {
									select(selected);
									break;
								}
							}

							select($el.query(block.getElSelector('option')));
							break;
						}
					}
				}
			});
		});

		this.event.once(`block.state.ready`, () => {
			this.event.on('el.mod.set.options.hidden.true', () => {
				this.async.removeNodeEventListener({group: 'global'});
				if (this.block.getMod('focused') === 'false') {
					this.async.removeNodeEventListener({group: 'navigation'});
				}
			});

			this.event.on('block.mod.set.focused.false', () => {
				if (this.block.getElMod(this.$els.options, 'options', 'hidden') === 'true') {
					this.async.removeNodeEventListener({group: 'navigation'});
				}
			});
		});
	},

	ready() {
		this.$el.addEventListener('click', delegate(this.block.getElSelector('option'), (e) => {
			this.selected = e.delegateTarget.dataset['value'];
			this.close();
		}));
	}

}, tpls)

@block
export default class bSelect extends bInput {}
