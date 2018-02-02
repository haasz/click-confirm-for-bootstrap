/*!
 * Click confirm v1.3.0 (for Bootstrap)
 * Copyright (c) 2018 Haasz Sandor, http://haasz-sandor.hu
 * Released under the MIT license
 */
(function (options) {

	'use strict';


	// REQUIREMENTS

	// window (global scope, see (hungarian): http://weblabor.hu/blog/20100813/global-scope-elerese)
	var window = (0, eval)('this') || Function('return this')();
	if (!(window && typeof window === 'object' && window === window.window)) {
		throw new Error('Click confirm requires window');
	}

	// document
	var document = window.document;
	if (!document) {
		throw new Error('Click confirm requires document');
	}

	// jQuery
	var $ = window.jQuery;
	if (!$) {
		throw new Error('Click confirm requires jQuery');
	}

	// Bootstrap
	if (typeof $.fn.modal !== 'function') {
		throw new Error('Click confirm requires Bootstrap');
	}


	// CLICK CONFIRM

	// Bindig selector
	var bindingSelector = '.click-confirm, [data-click-confirm]';

	// Default options
	var defaultOptions = {
		title: 'Confirm',
		question: 'Are you sure you want to click on it?',
		no: 'Cancel',
		ok: 'OK'
	};

	// Modal (HTML string)
	function getModalString() {
		return (
			'<div class="click-confirm-modal modal fade" tabindex="-1" role="dialog" aria-hidden="true">'
				+ '<div class="modal-dialog modal-dialog-centered" role="document">'
					+ '<div class="modal-content">'
						+ '<div class="modal-header flex-row-reverse">'
							+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
								+ '<span aria-hidden="true">&times;</span>'
							+ '</button>'
							+ '<h4 class="modal-title">'
								// + 'Title'
							+ '</h4>'
						+ '</div>'
						+ '<div class="modal-body">'
							// + 'Question'
						+ '</div>'
						+ '<div class="modal-footer">'
							+ '<button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">'
								// + 'No'
							+ '</button>'
							+ '<button type="button" class="btn btn-primary" data-dismiss="modal">'
								// + 'OK'
							+ '</button>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		);
	}

	function getModal(clickedElement) {
		return setModal(
			createModal(),
			getOptions(clickedElement)
		);
	}

	function createModal() {
		var parent = document.createElement('div');
		parent.innerHTML = getModalString();
		return parent.childNodes[0];
	}

	function getOption(clickedElement, option) {
		return (
			clickedElement.hasAttribute('data-click-confirm-text-' + option)
			? clickedElement.getAttribute('data-click-confirm-text-' + option)
			: defaultOptions[option]
		);
	}

	function getOptions(clickedElement) {
		return {
			clickedElement: clickedElement,
			title: getOption(clickedElement, 'title'),
			question: getOption(clickedElement, 'question'),
			no: getOption(clickedElement, 'no'),
			ok: getOption(clickedElement, 'ok')
		};
	}

	function getAbsoluteUrl(url) {
		var div = document.createElement('div');
		div.appendChild(
			document.createElement('a')
		);
		div.firstChild.href = url;
		div.innerHTML = div.innerHTML;
		return ('' + div.firstChild.href);
	}

	function setModal(modal, options) {
		var $modal = $(modal);
		// Subtitles
		$modal.find('.modal-title').text(options.title);
		$modal.find('.modal-body').text(options.question);
		$modal.find('.modal-footer .btn-default').text(options.no);
		$modal.find('.modal-footer .btn-primary')
			.text(options.ok)
		// Function
			.click(function (event) {
				$modal
					.on(
						'hidden.bs.modal',
						function (event) {

							var clickedElement = options.clickedElement;
							var isProtected = clickedElement.hasAttribute('data-click-confirm-href');
							var tagName;
							var isHyperLink;
							var href;

							// Preprocessing
							if (isProtected) {
								tagName = clickedElement.tagName.toLowerCase();
								isHyperLink = (
									tagName === 'a'
									||
									tagName === 'area'
								);
								if (isHyperLink) {
									href = (
										clickedElement.hasAttribute('href')
										? clickedElement.getAttribute('href')
										: undefined
									);
									clickedElement.setAttribute(
										'href',
										clickedElement.getAttribute('data-click-confirm-href')
									);
								}
							}

							// Click
							clickedElement.isClickConfirmed = true;
							clickedElement.click();

							// Postprocessing
							if (isProtected) {
								if (isHyperLink) {
									if (typeof href !== 'undefined') {
										clickedElement.setAttribute('href', href);
									}
									else {
										clickedElement.removeAttribute('href');
									}
								}
								else {
									window.location.href = getAbsoluteUrl(
										clickedElement.getAttribute('data-click-confirm-href')
									);
								}
							}
						}
					)
				;
			})
		;
		return modal;
	}

	function resetClickedElement(clickedElement) {
		clickedElement.isClickConfirmed = undefined;
		delete clickedElement.isClickConfirmed;
	}

	function clickConfirm(event) {

		// Event (cross browser)
		event = event || window.event;

		// Clicked element
		var clickedElement = this;

		// Is click confirmed?
		if (clickedElement.isClickConfirmed) {
			resetClickedElement(clickedElement);
			return true;
		}

		// Disables the default operation (cross browser)
		if (event.preventDefault) { event.preventDefault(); }
		// Stop propagation (cross browser)
		if (event.stopPropagation) { event.stopPropagation(); } else { event.cancelBubble = true; }

		// Get modal
		var modal = getModal(clickedElement);

		// Add modal to document
		document.body.appendChild(modal);

		// Open modal
		$(modal)
			.on(
				'hidden.bs.modal',
				function (event) {
					modal.parentNode.removeChild(modal);
					modal = undefined;
				}
			)
			.modal(
				'show'
			)
		;

		// Disables the default operation (old browser)
		return false;

	}

	function config(options) {
		if (options && typeof options === 'object') {
			for (var key in defaultOptions) {
				if (defaultOptions.hasOwnProperty(key)) {
					if (typeof options[key] !== 'undefined') {
						defaultOptions[key] = '' + options[key];
					}
				}
			}
		}
	}


	// INITIALIZATION

	// Add config method
	clickConfirm.config = config;

	// Click confirm (global function)
	window.clickConfirm = clickConfirm;

	// Set default configuration
	window.clickConfirm.config(options);

	// Set click confirm to the specified elements
	$(function () {
		$(bindingSelector).click(clickConfirm);
	});

})(
/*!
 *	// Custom default options
 *	{
 *		title: 'Confirm',
 *		question: 'Are you sure you want to click on it?',
 *		no: 'Cancel',
 *		ok: 'OK'
 *	}
 */
);
