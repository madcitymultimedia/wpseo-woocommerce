import { openWooCommerceTab, scrollToElement } from "./helpers";

/**
 * Opens a WooCommerce tab and then focuses on a Product input field.
 *
 * @returns {void}
 */
function focusOnSKUField() {
	openWooCommerceTab( ".inventory_tab" );
	const element = document.getElementById( "_sku" );
	element.focus();
	scrollToElement( element, { top: -300 } );
}

/**
 * Opens the Yoast tab in the WooCommerce metabox and scrolls to the
 * section where the user can input a product identifier.
 *
 * @returns {void}
 */
function scrollToProductIdentifiers() {
	openWooCommerceTab( ".yoast_tab_tab" );
	const productIdentifierTab = document.getElementById( "yoast_seo" );
	scrollToElement( productIdentifierTab, { top: -200 } );
}

/**
 * Handles the input focus for simple products, e.g. after clicking the edit button next to an assessment.
 *
 * @param {string} id The ID of the assessment edit button that was clicked.
 *
 * @returns {void}
 */
function handleInputFocusForSimpleProducts( id ) {
	if ( id === "productSKU" ) {
		focusOnSKUField();
		return;
	}

	if ( id === "productIdentifier" ) {
		scrollToProductIdentifiers();
	}
}

export default handleInputFocusForSimpleProducts;
