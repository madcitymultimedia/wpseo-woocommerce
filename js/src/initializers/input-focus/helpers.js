/**
 * Open the variations tab in the WooCommerce metabox.
 *
 * @param {string} tabSelector The query selector to use to select the tab.
 * @returns {void}
 */
function openWooCommerceTab( tabSelector ) {
	const tabLink = document.querySelector( tabSelector + " a" );
	if ( ! tabLink ) {
		return;
	}
	tabLink.click();
}

/**
 * Scrolls the window to the given element.
 *
 * @param {Element} element The element to scroll to.
 *
 * @param {Object} offset? Optional offset from the element to scroll to.
 * @param {Number} [offset.left] Optional left offset.
 * @param {Number} [offset.top] Optional top offset.
 *
 * @returns {void}
 */
function scrollToElement( element, offset = {} ) {
	offset = Object.assign( { top: 0, left: 0 }, offset );
	const rect = element.getBoundingClientRect();
	window.scrollBy( rect.left + offset.left, rect.top + offset.top );
}

/**
 * Open the given variation, if it has not been opened already.
 *
 * @param {Element} variationElement The variation element.
 * @param {Number} variationIndex The variation index.
 *
 * @returns {void}
 */
function openVariation( variationElement, variationIndex ) {
	if ( ! variationElement.classList.contains( "open" ) ) {
		document.querySelectorAll( ".edit_variation" )[ variationIndex ].click();
	}
}

export {
	openWooCommerceTab,
	scrollToElement,
	openVariation,
};
