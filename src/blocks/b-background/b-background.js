/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

import { block, status } from '../../core/block';
import iBase, { on, mod } from '../i-base/i-base';
import $ from 'sprint';

@block()
export default class bBackground extends iBase {

	/**
	 * Block cache
	 */
	cache: ?Object;

	/** @override */
	constructor() {
		super(...arguments);
		this.defer = true;
		void async () => {
			this.cache = await this.loadBlockSettings() || {};
			this.state = this.status.ready;
		}();
	}

	/**
	 * Normalizes a string
	 * @param str - source string
	 */
	static clrfx(str: string): string {
		return str.replace(/[\s(),]/g, '_');
	}

	@mod('theme', 'dark')
	@on(status.ready)
	setDarkBackground() {
		const
			body = document.body,
			width = screen.width > body.scrollWidth ? screen.width : body.scrollWidth,
			height = screen.height > body.scrollHeight ? screen.height : body.scrollHeight,
			bgColor = $(this.node).css('background-color');

		const
			key = `dark-background-${width}-${height}-${bBackground.clrfx(bgColor)}`;

		if (this.cache[key]) {
			this.applyStyle(key, this.cache[key]);
			return;
		}

		const
			x = Math.floor(width / 2),
			y = Math.floor(height / 2);

		const
			canvas = document.createElement('canvas');

		canvas.width = width;
		canvas.height = height;

		const
			ctx = canvas.getContext('2d'),
			grad = ctx.createRadialGradient(x, y * 0.5, height * 0.3, x, y, height * 1.5);

		grad.addColorStop(0, 'rgba(0,0,0,0)');
		grad.addColorStop(0.6, bgColor);

		const
			dash = [2, 4];

		for (let i = width; i > 0; i -= 6) {
			ctx.beginPath();
			ctx.setLineDash(dash);
			ctx.lineDashOffset = 10;
			ctx.moveTo(i, 0);
			ctx.lineTo(i, height);
			ctx.closePath();
			ctx.stroke();
		}

		ctx.fillStyle = grad;
		ctx.rect(0, 0, width, height);
		ctx.fill();
		ctx.arc(424, 424, 424, 0, 2 * Math.PI, true);
		ctx.fill();

		this.applyStyle(key, canvas.toDataURL());
	}

	@mod('theme', 'metallic')
	@on(status.ready)
	setMetallicBackground() {
		const
			width = 340,
			height = 96;

		const
			key = `metallic-background-${width}-${height}`;

		if (this.cache[key]) {
			this.applyStyle(key, this.cache[key]);
			return;
		}

		const
			canvas = document.createElement('canvas');

		canvas.width = width;
		canvas.height = height;

		const
			ctx = canvas.getContext('2d'),
			grad = ctx.createLinearGradient(50, 0, 50, 100);

		grad.addColorStop(0, '#BFBFBF');
		grad.addColorStop(0.5, '#AAA');
		grad.addColorStop(1, '#BFBFBF');

		ctx.fillStyle = grad;
		ctx.rect(0, 0, width, height);
		ctx.fill();

		ctx.lineWidth = window['chrome'] || window['opera'] ? 0.3 : 0.4;

		const
			d = 6,
			n = width / d,
			colors = ['#CACACA', '#B6B6B6', '#BFBFBF', '#AAA'];

		for (let i = d + 1, j; i--;) {
			j = width;

			while (j -= 2 > 0) {
				ctx.strokeStyle = colors[Number.random(0, colors.length - 1)];
				ctx.beginPath();
				ctx.moveTo(i * n - Number.random(n / 2, n), j);
				ctx.lineTo(i * n - Number.random(0, n / 2), j);
				ctx.closePath();
				ctx.stroke();
			}
		}

		this.applyStyle(key, canvas.toDataURL());
	}

	/**
	 * Applies background style to the node
	 *
	 * @param className - class name
	 * @param dataURI - data:uri of a class image
	 */
	applyStyle(className: string, dataURI: string): bBackground {
		const style = document.createElement('style');
		style.innerHTML = `
			.${className} {
				background-image: url(${dataURI});
			}
		`;

		this.cache[className] = dataURI;
		this.saveBlockSettings(this.cache);

		document.head.appendChild(style);
		this.node.classList.add(className);

		return this;
	}
}
