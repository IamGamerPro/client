'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import iBlock, { wait } from '../i-block/i-block';
import * as tpls from './b-scroll.ss';
import { block, model, status } from '../../core/block';

@model({
	tag: 'span',
	methods: {
		/**
		 * Returns scroll offset
		 */
		getScrollOffset() {
			const
				{area} = this.$els;

			return {
				top: area.scrollTop,
				left: area.scrollLeft
			}
		},

		/**
		 * Sets scroll offset
		 *
		 * @param top - top offset
		 * @param left - left offset
		 */
		setScrollOffset({top, left}: {top?: number, left?: number}) {
			const
				{area} = this.$els;

			if (top !== undefined) {
				area.scrollTop = top;
			}

			if (left !== undefined) {
				area.scrollLeft = left;
			}
		},

		/**
		 * Returns scroll height
		 */
		getScrollHeight(): number {
			return this.$els.area.scrollHeight;
		},

		/**
		 * Returns block height
		 */
		getHeight(): number {
			return this.$els.area.clientHeight;
		},

		/**
		 * Sets block height
		 * @param height
		 */
		setHeight: function (height: number | string) {
			this.$els.area.style.maxHeight = Object.isString(height) ? height : height.px;
			this.calcScrollHeight();
		},

		/**
		 * Initializes scroll height
		 */
		@wait(status.ready)
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
		@wait(status.ready)
		calcScrollHeight() {
			const
				{area, scroller, scrollWrapper} = this.$els,
				{block: $b} = this;

			const
				scrollerMinHeight = parseFloat(getComputedStyle(scroller).minHeight),
				scrollerMaxHeight = parseFloat(getComputedStyle(area).maxHeight);

			const
				contentHeight = area.scrollHeight,
				scrollerHeight = Math.round(Math.pow(scrollerMaxHeight, 2) / contentHeight) + 1;

			if (contentHeight > scrollerMaxHeight) {
				scrollWrapper.style.height = scrollerMaxHeight.px;

				$b.setElMod(scrollWrapper, 'scroll-wrapper', 'hidden', false);
				scroller.style.height = (scrollerHeight < scrollerMinHeight ? scrollerMinHeight : scrollerHeight).px;

				this._maxScrollerPos = scrollerMaxHeight - scroller.offsetHeight;
				this._delta = (contentHeight - scrollerMaxHeight) / (scrollerMaxHeight - scroller.offsetHeight);

			} else {
				$b.setElMod(scrollWrapper, 'scroll-wrapper', 'hidden', true);
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
				this.$els.scroller.style.top = pos.px;

			} else {
				this.$els.area.scrollTop = pos * this._delta;
			}
		},

		/**
		 * Base scroll handler
		 */
		onScroll() {
			const {area} = this.$els;
			this.setScrollerPosition(this._maxScrollerPos * area.scrollTop / (area.scrollHeight - area.clientHeight), true);
		},

		/**
		 * The start of scroller drag
		 *
		 * @param e
		 * @param scroller - link to the element
		 */
		onScrollerDragStart(e: Event, scroller: Element) {
			this._scrollerOffsetY = e.pageY - scroller.offsetTop;
			this.block.setElMod(scroller, 'scroller', 'active', true);
		},

		/**
		 * Base scroller drag handler
		 * @param e
		 */
		onScrollerDrag(e: Event) {
			this.setScrollerPosition(e.pageY - this._scrollerOffsetY);
		},

		/**
		 * The end of scroller drag
		 */
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
