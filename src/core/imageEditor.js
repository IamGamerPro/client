'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

export default {
	/**
	 * Default config
	 */
	setup: {
		resize: {
			width: 200,
			height: 200,
			skipTest: false,
			minWidth: 200,
			minHeight: 200,
			maxWidth: 7e3,
			maxHeight: 7e3,
			ratio: [2, 3],
			lobes: 1
		}
	},

	/**
	 *
	 * @param params
	 */
	async resize(params: Object): Promise<{canvas: HTMLCanvasElement, id?: string}> {
		const
			p = Object.assign({}, this.setup.resize, params);

		const
			{canvas, img, id, lobes} = p;

		let
			{width: iWidth, height: iHeight} = img;

		canvas.width = iWidth;
		canvas.height = iHeight;

		if (!p.skipTest) {
			if (
				iWidth < p.minWidth ||
				iWidth > p.maxWidth ||
				iHeight < p.minHeight ||
				iHeight > p.maxHeight ||
				iWidth > p.ratio[0] * iHeight ||
				iHeight > p.ratio[1] * iWidth
			) {

				throw new Error(i18n('Некорректное изображение'));
			}
		}

		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);

		const
			side = iWidth > iHeight,
			{width: maxWidth, height: maxHeight} = p;

		if (side ? iWidth <= maxWidth : iHeight <= maxHeight) {
			return canvas;
		}

		if ((side ? iWidth / maxWidth : iHeight / maxHeight) <= 2.5 && lobes === 1) {
			let
				lWidth,
				lHeight;

			if (side) {
				lWidth = maxWidth;
				lHeight = Math.round((iHeight * maxWidth) / iWidth);

			} else {
				lHeight = maxHeight;
				lWidth = Math.round((iWidth * maxHeight) / iHeight);
			}

			canvas.width = lWidth;
			canvas.height = lHeight;

			ctx.drawImage(img, 0, 0, lWidth, lHeight);
			return {canvas, id};
		}

		const
			max = 700;

		let
			pHeight,
			pWidth;

		if (side) {
			pWidth = max;
			pHeight = Math.round((iHeight * max) / iWidth);

		} else {
			pHeight = max;
			pWidth = Math.round((iWidth * max) / iHeight);
		}

		let pre;
		if ((side ? img.width > pWidth : img.height > pHeight) && lobes === 1) {
			canvas.width = pWidth;
			canvas.height = pHeight;
			ctx.drawImage(img, 0, 0, pWidth, pHeight);
			pre = true;

		} else {
			canvas.width = iWidth;
			canvas.height = iHeight;

			ctx.drawImage(img, 0, 0);
		}

		iWidth = pre ? pWidth : iWidth;
		iHeight = pre ? pHeight : iHeight;

		let
			width,
			height;

		if (side) {
			width = maxWidth;
			height = Math.round((iHeight * maxWidth) / iWidth);

		} else {
			height = maxHeight;
			width = Math.round((iWidth * maxHeight) / iHeight);
		}

		if (side ? iWidth <= width : iHeight <= height) {
			return {canvas, id};
		}

		let
			workerCount = 1,
			counter;

		function createWorker(num) {
			if (counter === undefined) {
				counter = workerCount;
			}

			const original = ctx.getImageData(
				Math.floor((num * iWidth) / workerCount),
				0,
				Math.floor(((num + 1) * iWidth) / workerCount),
				iHeight
			);

			const
				start = Math.floor((num * width) / workerCount),
				end = Math.floor(((num + 1) * width) / workerCount);

			const final = ctx.getImageData(
				start,
				0,
				end,
				height
			);

			const
				worker = new Worker('/core/graph/resizer.js');

			worker.postMessage({
				id,
				lobes,
				original,
				final
			});

			worker.onmessage = ({data: {event: e}}) => {
				switch (e.type) {
					case 'init':
						p.init && p.init(e.data.id);
						break;

					case 'progress':
						p.progress && p.progress(e.data.progress, e.data.id);
						break;

					case 'result':
						if (counter === workerCount) {
							canvas.width = width;
							canvas.height = height;
						}

						ctx.putImageData(e.data.img, start, 0, 0, 0, end, height);
						counter--;

						if (!counter) {
							return {canvas, id};
						}

						break;
				}
			};

			return worker;
		}

		let workers = [];
		for (let i = 0; i < workerCount; i++) {
			workers.push(createWorker(i));
		}

		return workers;
	}
};
