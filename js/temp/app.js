/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
(function (OC, OCA, window, $) {
	'use strict';

	/**
	 * Instantiates all necessary objects to construct the app.
	 * @public
	 * @class Ocr.App
	 */
	var App = (function () {
		/** 
		 * The Ocr wide config parameters.
		 * @private
		 * @static
		 */
		var config = {
			STATUS_ENDPOINT: OC.generateUrl('/apps/ocr/status'),
			PROCESSING_ENDPOINT: OC.generateUrl('/apps/ocr'),
			ALLOWED_MIMETYPES: ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'],
		};

		/**
		 * Inner class
		 * @private
		 * @returns class
		 */
		var App = function () {
			/** Constructor */

			/** Instantiation of the OCA.Ocr.View. */
			this.$view = new OCA.Ocr.View();

			/** Instantiation of the OCA.Ocr.HttpService with OCR config as input parameter. */
			this.$httpService = new OCA.Ocr.HttpService(config);

			/** Instantiation of the OCA.Ocr.Util with OCR config as input parameter. */
			this.$util = new OCA.Ocr.Util(config);

			/** Instantiation of the OCA.Ocr.Controller with OCR config as input parameter. */
			this.$controller = new OCA.Ocr.Controller(this.$view, this.$util, this.$httpService);
			
			this.init = function () {
				this.$controller.init();
			}

		}

		return App;
	})();
	/**
	 * Register the App in the namespace
	 */
	/** We have to be in the Files App! */
	if (!OCA.Files) {
		return;
	}
	/** Escape when the requested file is public.php */
	if (/(public)\.php/i.exec(window.location.href) !== null) {
		return;
	}
	/** Create namespace Ocr */
	if (!OCA.Ocr) {
		OCA.Ocr = {};
	}
	OCA.Ocr.App = App;
	/** global: OC, OCA */
})(OC, OCA, window, jQuery);
