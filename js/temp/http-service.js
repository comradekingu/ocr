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
     * Communicates with OCR backend API.
     * @public
	 * @class Ocr.HttpService
	 */
	var HttpService = function (config) {

		/** Constructor */
		var ocrConfig;
		config !== undefined ? ocrConfig = config : console.error('OCR config is not defined.');

        /**
         * 
         * @private
         * @param {Object} opts (opts.data, opts.method, opts.url)
         * @returns {$.Deferred.Promise} resolve with response or reject in case of error
         */
		var makeRequest = function (opts) {
			return $.ajax(opts);
		}

        /** 
         * Load all languages that are supported form the backend.
         * @public
         * @returns {$.Deferred}
         */
		this.loadAvailableLanguages = function () {
            var languages = ['deu', 'eng'];
			// TODO: enable docker behavior
			/*OCP.AppConfig.getValue('ocr', 'available-languages', '', function (data) {
                languages = data.split(';');
            });*/
            return languages;
		}

        /**
         * Triggers the OCR process for the given files and languages.
         * @public
         * @returns {$.Deferred}
         */
		this.process = function (selectedFiles, selectedLanguages) {
			return makeRequest({
				method: 'POST',
				url: ocrConfig.PROCESSING_ENDPOINT,
				data: {
					files: selectedFiles,
					languages: selectedLanguages
				},
			});
		}

        /**
         * Check for the status of the OCR process.
         * @public
         * @returns {$.Deferred}
         */
		this.checkStatus = function () {
			return makeRequest({
				method: 'GET',
				url: ocrConfig.STATUS_ENDPOINT,
			});
		}
	}

	/**
	 * Init OCR HttpService
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
	OCA.Ocr.HttpService = HttpService;

	/** global: OC, OCA */
})(OC, OCA, window, jQuery);
