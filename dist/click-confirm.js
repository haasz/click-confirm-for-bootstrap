/*!
 * Click confirm v2.9.1 (for Bootstrap)
 * Copyright (c) 2018 Haasz Sandor, http://haasz-sandor.hu
 * Released under the MIT license
 *
 * Supported all modern browsers and IE 9+
 */
(function (options) {

	'use strict';


	// REQUIREMENTS

	// window (global scope, see (hungarian): http://weblabor.hu/blog/20100813/global-scope-elerese)
	var window = (0, eval)('this') || Function('return this')();
	if (!(window && typeof window === 'object' && window === window.window)) {
		throw new Error('The Click confirm requires window');
	}

	// document
	var document = window.document;
	if (!document) {
		throw new Error('The Click confirm requires document');
	}

	// jQuery
	var $ = window.jQuery;
	if (!$) {
		throw new Error('The Click confirm requires jQuery');
	}

	// Bootstrap
	if (typeof $.fn.modal !== 'function') {
		throw new Error('The Click confirm requires Bootstrap');
	}


	// CLICK CONFIRM

	// Bindig selector
	var bindingSelector = '.click-confirm, [data-click-confirm]';

	// Default options
	var defaultOptions = {
		mode: 2,
		fullStop: true,
		language: undefined,
		htmlEnabled: false,
		text: {
			title: 'Confirm',
			question: 'Are you sure you want to click on it?',
			no: 'Cancel',
			ok: 'OK'
		}
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

	function getLanguageOption(clickedElement) {
		if (clickedElement.hasAttribute('data-click-confirm-language')) {
			var language = clickedElement.getAttribute('data-click-confirm-language');
			return language ? '' + language : undefined;
		}
		return defaultOptions.language;
	}

	function getHtmlEnabled(clickedElement) {
		return !!(
			clickedElement.hasAttribute('data-click-confirm-html-disabled')
			? false
			: (
				clickedElement.hasAttribute('data-click-confirm-html-enabled')
				||
				defaultOptions.htmlEnabled
			)
		);
	}

	function getTextOption(clickedElement, option) {
		return (
			clickedElement.hasAttribute('data-click-confirm-text-' + option)
			? '' + clickedElement.getAttribute('data-click-confirm-text-' + option)
			: defaultOptions.text[option]
		);
	}

	function getOptions(clickedElement) {
		return {
			clickedElement: clickedElement,
			language: getLanguageOption(clickedElement),
			htmlEnabled: getHtmlEnabled(clickedElement),
			title: getTextOption(clickedElement, 'title'),
			question: getTextOption(clickedElement, 'question'),
			no: getTextOption(clickedElement, 'no'),
			ok: getTextOption(clickedElement, 'ok')
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
		// Language
		if (options.language) {
			modal.setAttribute('lang', options.language);
		}
		// Text method (text or html)
		var textMethod = options.htmlEnabled ? 'html' : 'text';
		// Subtitles
		$modal.find('.modal-title')[textMethod](options.title);
		$modal.find('.modal-body')[textMethod](options.question);
		$modal.find('.modal-footer .btn-default')[textMethod](options.no);
		$modal.find('.modal-footer .btn-primary')[textMethod](options.ok)
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
		// Stop the propagation immediately (all modern browsers and IE 9+)
		if (defaultOptions.fullStop && event.stopImmediatePropagation) { event.stopImmediatePropagation(); }

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

	function listener(event) {
		// Event (cross browser)
		event = event || window.event;
		// Clicked element
		var clickedElement;
		for (
			var target = event.target
			; target && target !== this.parentNode
			; target = target.parentNode
		) {
			if ($(target).filter(bindingSelector).length) {
				clickedElement = target;
				break;
			}
		}
		return (
			clickedElement
			? clickConfirm.call(clickedElement, event)
			: true
		);
	}


	// The last document.ready call id
	var readyCallId = 0;

	// The targets of listenings
	var $listeningTargets = [];

	// Is the mode set?
	var isModeSet = false;

	/**
	 * Bind the clickConfirm from the target or child elements to the specified ones.
	 *
	 * @this clickConfirm
	 *
	 * @param  {Element|string} [target] The target (element or selector, default: document).
	 *
	 * @return {Function}                The "this" (to chaining), that is the clickConfirm function.
	 */
	function bind(target) {
		var id = ++readyCallId;
		$(function () {
			if (id === readyCallId) {
				var $bindingTarget;
				if (typeof target !== 'undefined') {
					var $target = $(target);
					var $filteredTarget = $target.filter(bindingSelector);
					$bindingTarget =
						$filteredTarget.length
						? $filteredTarget
						: $target.find(bindingSelector)
					;
				}
				else {
					$bindingTarget = $(bindingSelector);
				}
				// Bind
				$bindingTarget.click(clickConfirm);
			}
		});
		return this;
	}

	/**
	 * Unbind the clickConfirm from all specified elements.
	 *
	 * @this clickConfirm
	 *
	 * @return {Function} The "this" (to chaining), that is the clickConfirm function.
	 */
	function resetBind() {
		// Inactivate the previous document.ready call
		++readyCallId;
		$(function () {
			// Unbind
			$(bindingSelector).off('click', clickConfirm);
		});
		return this;
	}

	/**
	 * Set the listening on the target element(s) and dynamic binding the clickConfirm to the specified element(s) in the target element(s).
	 *
	 * @this clickConfirm
	 *
	 * @param  {Element|string} [target] The target (element or selector, default: document.documentElement).
	 *
	 * @return {Function}                The "this" (to chaining), that is the clickConfirm function.
	 */
	function listen(target) {
		var $listeningTarget =
			$(
				typeof target === 'undefined'
				? document.documentElement
				: target
			)
		;
		$listeningTargets.push($listeningTarget);
		// All modern browsers and IE 9+
		if (window.addEventListener) {
			$listeningTarget.each(function () {
				this.addEventListener('click', listener, true);
			});
		}
		// Old browsers (IE 8 or older) (Not supported!)
		else {
			$listeningTarget.click(listener);
		}
		return this;
	}

	/**
	 * Remove all previously set listening (dynamic binding).
	 *
	 * @this clickConfirm
	 *
	 * @return {Function} The "this" (to chaining), that is the clickConfirm function.
	 */
	function resetListen() {
		for (var i = $listeningTargets.length - 1; i >= 0; --i) {
			// All modern browsers and IE 9+
			if (window.addEventListener) {
				$listeningTargets[i].each(function () {
					this.removeEventListener('click', listener, true);
				});
			}
			// Old browsers (IE 8 or older) (Not supported!)
			else {
				$listeningTargets[i].off('click', listener);
			}
		}
		$listeningTargets = [];
		return this;
	}

	/**
	 * Modify the default configuration.
	 *
	 * @this clickConfirm
	 *
	 * @param  {Object} [options] The options.
	 *
	 * @return {Function}         The "this" (to chaining), that is the clickConfirm function.
	 */
	function config(options) {
		// Set default options
		if (options && typeof options === 'object') {
			// Set mode option
			switch (options.mode) {
				case 2:
				case 1:
				case 0:
					if (isModeSet) {
						// Reset
						clickConfirm.resetListen();
						clickConfirm.resetBind();
						isModeSet = false;
					}
					defaultOptions.mode = options.mode;
					break;
				default:
					break;
			}
			// Set fullStop option
			if ('fullStop' in options) {
				defaultOptions.fullStop = !!options.fullStop;
			}
			// Set language option
			if ('language' in options) {
				defaultOptions.language = options.language ? '' + options.language : undefined;
			}
			// Set htmlEnabled option
			if ('htmlEnabled' in options) {
				defaultOptions.htmlEnabled = !!options.htmlEnabled;
			}
			// Set text options
			if (options.text && typeof options.text === 'object') {
				for (var option in defaultOptions.text) {
					if (defaultOptions.text.hasOwnProperty(option)) {
						defaultOptions.text[option] = '' + options.text[option];
					}
				}
			}
		}
		// Set mode
		if (!isModeSet) {
			switch (defaultOptions.mode) {
				// Auto listening
				case 2:
					clickConfirm.listen();
					break;
				// Auto binding
				case 1:
					clickConfirm.bind();
					break;
				// Nothing
				case 0:
				default:
					break;
			}
			isModeSet = true;
		}
		return this;
	}


	// INITIALIZATION

	// Add bind method
	clickConfirm.bind = bind;

	// Add resetBind method
	clickConfirm.resetBind = resetBind;

	// Add listen method
	clickConfirm.listen = listen;

	// Add resetListen method
	clickConfirm.resetListen = resetListen;

	// Add config method
	clickConfirm.config = config;

	// Set default configuration
	clickConfirm.config(options);

	// The clickConfirm (global function)
	window.clickConfirm = clickConfirm;

})(
/*!
	// Custom default options
	{
		// Modes:
		// 	2 - auto listening and dynamic binding (default)
		// 	1 - auto binding when document is ready
		// 	0 - no binding
		mode: 2,

		// Full stop (default: true)
		fullStop: true,

		// Language (default: undefined)
		// Required only if the language of the confirmation request differs from the language of the page.
		language: undefined,

		// HTML enabled (default: false)
		htmlEnabled: false,

		// Texts
		text: {
			// Title (default: 'Confirm')
			title: 'Confirm',

			// Question (default: 'Are you sure you want to click on it?')
			question: 'Are you sure you want to click on it?',

			// No (default: 'Cancel')
			no: 'Cancel',

			// OK (default: 'OK')
			ok: 'OK'
		}
	}
*/
);
