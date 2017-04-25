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
     * Adds some util functions mainly used by the OCR controller.
     * @public
     * @class Ocr.Util
     */
    var Util = function (config) {

         /** Constructor */
        var ocrConfig;
        config !== undefined ? ocrConfig = config : console.error('OCR config is not defined.');

        /** TODO:
         * Filter file array for files with supported mimetypes and return 
         * the clean array of all input elements with a proper mimetype.
         * @public
         * @param {Array<File>} selectedFiles
         * @returns {Array<File>}
         */
        this.filterFilesWithMimeTypes = function (selectedFiles) {
			return selectedFiles.filter(function(file){
                return ocrConfig.ALLOWED_MIMETYPES.indexOf(file.mimetype) == -1 ? false : true;
			});
		}

        /** Reduce the input array of file elements to only contain the file id.
         * @public
         * @param {Array<File>} files
         * @returns {Array<File>}
         */
        this.shrinkData = function(files) {
			return files.map(function(file){
				return {id: file.id};
			});
		}

    }

	/**
	 * Init OCR Util
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
    OCA.Ocr.Util = Util;

    /** global: OC, OCA */
})(OC, OCA, window, jQuery);
