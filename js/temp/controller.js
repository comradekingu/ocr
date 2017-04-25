/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
(function (OC, OCA, window, $, _) {
    'use strict';
    /**
     * Integrates the service with the view.
     * @public
     * @class Ocr.Controller
     * @param Ocr.View
     * @param Ocr.Util
     * @param Ocr.HttpService
     */
    var Controller = function (view, util, httpService) {
        /** Constructor */
        /** Instance of the OCA.Ocr.View. */
        var ocrView;
        view !== undefined ? ocrView = view : console.error('OCR view is not defined.');
        /** Instance of the OCA.Ocr.Util. */
        var ocrUtil;
        util !== undefined ? ocrUtil = util : console.error('OCR util is not defined.');
        /** Instance of the OCA.Ocr.HttpService. */
        var ocrHttpService;
        httpService !== undefined ? ocrHttpService = httpService : console.error('OCR http service is not defined.');
        /** Load the languages that are available for processing. */
        var languages = ocrHttpService.loadAvailableLanguages();
        languages.length > 0 ? '' : console.error('No languages available for OCR processing. Please make sure, that the Docker Container is up and running.');
        /** Currently selected files. */
        var selectedFiles = [];
        /** Current status. */
        var status = {};

        /**
         * Sets the filtered/cleaned selectedFiles array.
         * @private
         * @param {Array<File>} files 
         */
        var setSelectedFiles = function (files) {
            files = ocrUtil.shrinkData(ocrUtil.filterFilesWithMimeTypes(files));
            selectedFiles = files;
        }

        /**
         * Gets the selectedFiles array
         * @private
         * @returns {Array<File>}
         */
        var getSelectedFiles = function () {
            return selectedFiles;
        }

        /**
         * Sets the retrieved status.
         * @private
         * @param {Object} status
         */
        var setStatus = function (state) {
            status = state;
        }

        /**
         * Gets the retrieved status.
         * @private
         * @returns {Object}
         */
        var getStatus = function () {
            return status;
        }

        /**
         * Checks if the click events target was the OCR dropdown or not.
         * @param {Event} event 
         */
        var clickOnOtherEvent = function (event) {
            ocrView.checkClickOther(event) ? setSelectedFiles([]) : '';
        }

        /**
         * Triggers the rendering of the OCR dropdown for a single file action.
         * Is the Actionhandler which is registered within the registerFileActions method.
         * @link registerFileActions
         * @private
         * @param {*} file 
         * @param {*} context 
         */
        var fileActionHandler = function (file, context) {
            var id = context.$file.attr('data-id');
            var mimetype = context.fileActions.getCurrentMimeType();
            var files = [{ id: id, mimetype: mimetype }];
            setSelectedFiles(files);
            ocrView.renderFileAction(file, languages);
        }

        /**
         * Registers the FileAction options in the file actions menu for pdf and images.
         * @private
         */
        var registerFileActions = function () {
            // Register FileAction for mimetype pdf
            OCA.Files.fileActions.registerAction({
                name: 'Ocr',
                displayName: t('ocr', 'OCR'),
                order: 100,
                mime: 'application/pdf',
                permissions: OC.PERMISSION_UPDATE,
                altText: t('ocr', 'OCR'),
                iconClass: 'icon-ocr',
                actionHandler: fileActionHandler
            });
            // Register FileAction for mimetype image
            OCA.Files.fileActions.registerAction({
                name: 'Ocr',
                displayName: t('ocr', 'OCR'),
                order: 100,
                mime: 'image',
                permissions: OC.PERMISSION_UPDATE,
                altText: t('ocr', 'OCR'),
                iconClass: 'icon-ocr',
                actionHandler: fileActionHandler
            });
        }

        /**
         * Triggers the rendering of the OCR dropdown for the top bar
         * selected files action button and sets the selectedFiles.
         * @private
         */
        var clickOnTopBarSelectedFilesActionButton = function () {
            ocrView.renderFileAction(undefined, languages);
            setSelectedFiles(OCA.Files.App.fileList.getSelectedFiles());
        }

        /**
         * Triggers the view to show the selected files action button in the top bar
         * and sets the selectedFiles array.
         * @private
         */
        var toggleSelectedFilesActionButton = function () {
            var selFiles = OCA.Files.App.fileList.getSelectedFiles();
            if (selFiles.length > 0 && typeof selFiles !== undefined) {
                ocrView.toggleSelectedFilesActionButton(true);
                setSelectedFiles(selFiles);
            } else {
                ocrView.toggleSelectedFilesActionButton(false);
                setSelectedFiles([]);
            }
        }

        /**
         * Triggers the view to hide the selected files action button in the top bar
         * and empties the selectedFiles array.
         * @private
         */
        var hideSelectedFilesActionButton = function () {
            ocrView.toggleSelectedFilesActionButton(false);
            setSelectedFiles([]);
        }

        /**
         * Retrieves the status of the OCR process.
         * @private
         * @returns {$.Deferred}
         */
        var checkStatus = function () {
            var deferred = $.Deferred();
            ocrHttpService.checkStatus().done(function (status) {
                setStatus(status);
                deferred.resolve(status);
            }).fail(function (jqXHR) {
                deferred.reject(jqXHR.responseText);
            });
            return deferred.promise();
        }

        /** 
         * Reloads the OCA.Files.App.fileList. 
         * @private
         */
        var updateFileList = function () {
            OCA.Files.App.fileList.reload();
            toggleSelectedActionButton();
        }

        /**
         * Trigger the pending notification for the first time (with initialcount)
         * or after that without initialcount (undefined).
         * @private
         * @param {boolean} force - If new files in queue or already in the regular loop.
         * @param {number} initialcount - How much files initially to process (number or undefined).
         */
        var togglePendingState = function (force, initialcount) {
            var count;
            var pendingcount = getStatus().pending;
            initialcount !== undefined ? count = initialcount : count = pendingcount;
            ocrView.togglePendingNotification(force, count);
        }

        /**
         * Loops as long as there are pending files in the OCR queue.
         * @private
         */
        var loopForStatus = function () {
            $.when(checkStatus()).done(function () {
                if (getStatus().failed > 0) { ocrView.displayError(n('ocr', 'OCR processing for %n file failed. For details please go to your personal settings.', 'OCR processing for %n files failed. For details please go to your personal settings.', getStatus().failed)); }
                if (getStatus().pending > 0) {
                    if (getStatus().processed > 0) { updateFileList(); }
                    togglePendingState(false);
                    setTimeout($.proxy(loopForStatus, this), 4500);
                } else {
                    if (getStatus().processed > 0) { updateFileList(); }
                    togglePendingState(false);
                }
            }).fail(function (message) {
                ocrView.displayError(t('ocr', 'OCR status could not be retrieved:') + ' ' + message);
                setTimeout($.proxy(loopForStatus, self), 4500);
            });
        }

        /**
         * Triggers the OCR process for the selectedFiles array
         * and toggles the "pending" state for the ocr process.
         * @private
         */
		var clickOnProcessButtonEvent = function () {
			if (getSelectedFiles().length == 0) {
				ocrView.displayError(t('ocr', 'OCR processing failed:') + ' ' + t('ocr', 'Mimetype not supported.'));
				ocrView.destroyDropdown();
			} else {
				var selectedLanguages = $('#ocrLanguage').select2('val');
				ocrHttpService.process(getSelectedFiles(), selectedLanguages).done(function (status) {
					togglePendingState(true, getSelectedFiles().length);
					setSelectedFiles([]);
					setTimeout($.proxy(loopForStatus, this), 4500);
				}).fail(function (jqXHR) {
					ocrView.displayError(t('ocr', 'OCR processing failed:') + ' ' + jqXHR.responseText);
				}).always(function () {
					ocrView.destroyDropdown();
				});
			}
		}

        /**
         * Registers the events and the appropriate methods of the view.
         * @private
         */
        var registerEvents = function () {
            // Click on another element then the dropdown
            $(document).click(function (event) {
                clickOnOtherEvent(event);
            });
            // Click on process button
            $(document).on('click', '#processOCR', function () {
                clickOnProcessButtonEvent();
            });
            // Click on top bar OCR button
            $(document).on('click', '#selectedFilesOCR', function () {
                clickOnTopBarSelectedFilesActionButton();
                return false;
            });

            // Register click events on file menu OCR option
            registerFileActions();

            // Register checkbox events
            _.defer(function () {
                OCA.Files.App.fileList.$fileList.on('change', 'td.filename>.selectCheckBox', _.bind(toggleSelectedFilesActionButton, this));
                OCA.Files.App.fileList.$el.find('.select-all').click(_.bind(toggleSelectedFilesActionButton, this));
                OCA.Files.App.fileList.$el.find('.delete-selected').click(_.bind(hideSelectedFilesActionButton, this));
            });
        }

        this.init = function () {
            registerEvents();
            ocrView.renderSelectedFilesActionButton();
            loopForStatus();
        }

        this.destroy = function () {
            ocrView.destroy();
            OCA.Files.fileActions.clear();
            OCA.Files.fileActions.registerDefaultActions();
        }
    }

	/**
	 * Init OCR Controller
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
    OCA.Ocr.Controller = Controller;

    /** global: OC, OCA */
})(OC, OCA, window, jQuery, _);
