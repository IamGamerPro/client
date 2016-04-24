'use strict';

/*!
 * IamGamer.pro Client
 * https://github.com/IamGamerPro/client
 *
 * Released under the FSFUL license
 * https://github.com/IamGamerPro/client/blob/master/LICENSE
 */

if (!HTMLCanvasElement.prototype.toBlob) {
	const hasBlobConstructor = (() => {
		try {
			return Boolean(new Blob());

		} catch (ignore) {
			return false;
		}
	})();

	const hasArrayBufferViewSupport = hasBlobConstructor && (() => {
		try {
			return new Blob([new Uint8Array(100)]).size === 100;

		} catch (ignore) {
			return false;
		}
	})();

	HTMLCanvasElement.prototype.toBlob = function (
		cb: (blob: Blob) => void,
		mime?: string = 'image/png',
		quality?: number = 1
	) {
		if (mime === 'image/png' && this.msToBlob) {
			cb(this.msToBlob());
			return;
		}

		const
			byteString = atob(this.toDataURL(mime, quality).replace(/[^,]*,/, '')),
			buffer = new ArrayBuffer(byteString.length),
			intArray = new Uint8Array(buffer);

		for (let i = 0; i < byteString.length; i++) {
			intArray[i] = byteString.charCodeAt(i);
		}

		if (hasBlobConstructor) {
			cb(new Blob(
				[hasArrayBufferViewSupport ? intArray : buffer],
				{type: mime}
			));

			return;
		}

		const
			builder = new MSBlobBuilder();

		builder['append'](buffer);
		cb(builder['getBlob'](mime));
	};
}
