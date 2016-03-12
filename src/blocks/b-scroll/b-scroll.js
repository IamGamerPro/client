'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock from '../i-block/i-block';
import * as tpls from './b-scroll.ss';
import { block, model } from '../../core/block';

@model({
	methods: {
		/**
		 * Sets scrolling position
		 *
		 * @param top - top offset
		 * @param left - left offset
		 */
		setScroll(top: number, left: number) {
			const
				{area} = this.$els;

			if (top != null) {
				area.scrollTop = top;
			}

			if (left != null) {
				area.scrollLeft = left;
			}
		},

		/**
		 * Sets block height
		 * @param height
		 */
		setHeight: function (height: number | string) {
			this.$el.style.height = Object.isString(height) ? height : `${height}px`;
			this.calcScrollHeight();
		},

		/**
		 * Initializes scroll height
		 */
		initScrollHeight() {
			const
				{area, scroller, scrollWrapper} = this.$els;

			scrollWrapper.style.height = scroller.style.height =
				getComputedStyle(area).maxHeight;

			this.block.setElMod(scrollWrapper, 'scroll-wrapper', 'hidden', false);
			this.putInStream(() => this.calcScrollHeight());
		},

		/**
		 * Calculates scroll height
		 */
		calcScrollHeight() {
			const
				{area, scroller, scrollWrapper} = this.$els;

			const
				scrollerMinHeight = parseFloat(getComputedStyle(scroller).minHeight),
				scrollerMaxHeight = parseFloat(getComputedStyle(area).maxHeight);

			const
				contentHeight = area.scrollHeight,
				scrollerHeight = Math.round(Math.pow(scrollerMaxHeight, 2) / contentHeight) + 1;

			if (contentHeight > scrollerMaxHeight) {
				scrollWrapper.style.height = `${scrollerMaxHeight}px`;

				this.block.setElMod(scrollWrapper, 'scroll-wrapper', 'hidden', false);
				scroller.style.height = `${scrollerHeight < scrollerMinHeight ? scrollerMinHeight : scrollerHeight}px`;

				this._maxScrollerPos = scrollerMaxHeight - scroller.offsetHeight;
				this._delta = (contentHeight - scrollerMaxHeight) / (scrollerMaxHeight - scroller.offsetHeight);

			} else {
				this.block.setElMod(scrollWrapper, 'scroll-wrapper', 'hidden', true);
			}

			return this;
		},

		/**
		 * Sets the scroller position
		 *
		 * @param pos - top offset
		 * @param pseudo - if true, then the scroll position won't be affected for the scroll
		 */
		setScrollerPosition: function (pos: number, pseudo?: boolean) {
			if (pseudo) {
				this.$els.scroller.style.top = `${pos}px`;

			} else {
				this.$els.area.scrollTop = pos * this._delta;
			}
		},

		onScroll() {
			const {area} = this.$els;
			this.setScrollerPosition(this._maxScrollerPos * area.scrollTop / (area.scrollHeight - area.clientHeight), true);
		},

		onScrollerDragStart(e, scroller) {
			this._scrollerOffsetY = e.pageY - scroller.offsetTop;
			this.block.setElMod(scroller, 'scroller', 'active', true);
		},

		onScrollerDrag(e) {
			this.setScrollerPosition(e.pageY - this._scrollerOffsetY);
		},

		onScrollerDragEnd() {
			this.block.setElMod(this.$els.scroller, 'scroller', 'active', false);
		}
	},

	ready() {
		this.initScrollHeight();
	}

}, tpls)

@block
export default class bScroll extends iBlock {}
