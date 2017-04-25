/**
 * nextCloud - ocr
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
(function (OC, OCA, window, $, Handlebars, _) {
    'use strict';
    /**
     * The view.
     * @public
     * @class Ocr.View
     */
    var View = (function () {
        /**
         * @private Handlebars.template
         * @static
         */
        var TEMPLATE_OCR_DROPDOWN = '<div id="ocrDropdown" class="ocrUserInterface">' +
            '<select id="ocrLanguage" class="multiselect" multiple="multiple">' +
            '{{#each languages}}' +
            '<option value="{{this}}">{{this}}</option>' +
            '{{/each}}' +
            '</select>' +
            '<input type="button" id="processOCR" value="' +
            t('ocr', 'Process') +
            '" />' +
            '</div>';

        /**
         * @private Handlebars.template
         * @static
         */
        var TEMPLATE_OCR_SELECTED_FILE_ACTION = '<span class="selectedActionsOCR hidden">' +
            '<a id="selectedFilesOCR" href="" class="ocr">' +
            '<span class="icon icon-ocr"></span>' +
            '<span class="pad-for-icon">' + t('ocr', 'OCR') + '</span>' +
            '</a>' +
            '</span>';

        /**
		 * Inner class
		 * @private
		 * @returns class
		 */
        var View = function () {
            /** The row of the notification for the pending state. */
            var notificationRow = undefined;

            /**
             * Renders the select2 select filed inside the OCR dropdown.
             * @private
             */
            var renderSelectTwo = function () {
                $("#ocrLanguage").select2({
                    width: 'element',
                    placeholder: t('ocr', 'Select language'),
                    formatNoMatches: function () {
                        return t('ocr', 'No matches found.');
                    }
                });
            }

            /**
             * Destroys the dropdown if existing.
             * @public
             */
            this.destroyDropdown = function () {
                if ($('#ocrDropdown').length) {
                    $('#ocrDropdown').detach();
                }
            }

            /**
             * Renders the dropdown with the given languages.
             * @public
             * @param {Array<String>} languages 
             */
            this.renderDropdown = function (languages) {
                this.destroyDropdown();
                var template = Handlebars.compile(TEMPLATE_OCR_DROPDOWN);
                return template({ languages: languages });
            }

            /**
             * Toggles the pending notification on the top of the window.
             * @public
             * @param {boolean} force - If new files in queue or already in the regular loop.
             * @param {number} count - How much files.
             */
            this.togglePendingNotification = function (force, count) {
                var html;
                if (force) {
                    html = '<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span>' + n('ocr', 'OCR started: %n new file in queue.', 'OCR started: %n new files in queue.', count) + '</span>';
                } else {
                    html = '<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span>' + ' ' + n('ocr', 'OCR: %n currently pending file in queue.', 'OCR: %n currently pending files in queue.', count) + '</span>';
                }
                if (count > 0 || force) {
                    if (notificationRow !== undefined) { OC.Notification.hide(notificationRow); }
                    notificationRow = OC.Notification.showHtml(html);
                } else {
                    if (notificationRow !== undefined) {
                        OC.Notification.hide(notificationRow);
                        notificationRow = undefined;
                    }
                }
            }

            /** 
             * Displays an error for a given message.
             * @public
             * @param {String} message
             */
            this.displayError = function (message) {
                OC.Notification.showHtml('<div>' + message + '</div>', { timeout: 10, type: 'error' });
            }

            /**
             * Hides or shows the selected files action button in the top bar.
             * @public
             */
            this.toggleSelectedFilesActionButton = function (show) {
                show ? $('.selectedActionsOCR').removeClass('hidden') : $('.selectedActionsOCR').addClass('hidden');
            }

            /** 
             * Renders the OCR dropdown for the FileActionMenu option 
             * OR TopBarSelectedFilesAction button depending on a input file.
             * @public
             * @param file
             * @param {Array<String>} languages
             */
            this.renderFileAction = function (file, languages) {
                var html = this.renderDropdown(languages);
                file !== undefined ? $(html).appendTo($('tr').filterAttr('data-file', file).find('td.filename')) : $(html).appendTo($('tr').find('th.column-name'));
                renderSelectTwo();
            }

            /** 
             * Checks if the ocrDropdown was not clicked.
             * @public
             * @param {Event} event
             */
            this.checkClickOther = function (event) {
                if (!$(event.target).closest('#ocrDropdown').length) {
                    this.destroyDropdown();
                    return true;
                } else {
                    return false;
                }
            }

            /**
             * Renders the selected files action button.
             * @public
             */
            this.renderSelectedFilesActionButton = function () {
                $(TEMPLATE_OCR_SELECTED_FILE_ACTION).appendTo($('#headerName-container'));
            }

            /**
             * Destroys the selected files action button.
             * @public
             */
            this.destroySelectedFilesActionButton = function () {
                $('.selectedActionsOCR').remove();
            }

            this.destroy = function() {
                this.destroySelectedFilesActionButton();
                this.destroyDropdown();
            }
        }

        return View;
    })();

	/**
	 * Init OCR View
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
    OCA.Ocr.View = View;

    /** global: OC, OCA, Handlebars, _ */
})(OC, OCA, window, jQuery, Handlebars, _);
