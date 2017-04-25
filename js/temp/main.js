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
	 * Init the App
	 */
	$(document).ready(function () {
		/** We have to be in the Files App! */
		if (!OCA.Files || !OCA.Files.App.fileList) {
			return;
		}
		/** Escape when the requested file is public.php */
		if (/(public)\.php/i.exec(window.location.href) !== null) {
			return;
		}
		/** Check for namespace Ocr */
		if (!OCA.Ocr) {
			return;
		}
		// Create instance
		OCA.Ocr.$app = new OCA.Ocr.App();
		
		OCA.Ocr.$app.init();

	});
    	/** global: OC, OCA */
})(OC, OCA, window, jQuery);
