import { addAction } from "@wordpress/hooks";

/**
 * Opens a WooCommerce tab and then focuses on a Product input field.
 *
 * @param {string} tabSelector The tab selector.
 * @param {string} fieldID The input field ID.
 * @returns {void}
 */
function focusOnProductField( tabSelector, fieldID ) {
	// Open the WooCommerce tab
	const tabLink = document.querySelector( tabSelector + " a" );
	if ( ! tabLink ) {
		return;
	}
	tabLink.click();

	// Focus on the element and scroll it into view.
	const element = document.getElementById( fieldID );
	if ( ! element ) {
		return;
	}
	element.focus();
	element.scrollIntoView( {
		behavior: "auto",
		block: "center",
		inline: "center",
	} );
}

/**
 * Focuses on the product field.
 * @param {string} id The id of the assessment.
 * @returns {void}
 */
function inputFocus( id ) {
	if ( id === "productSKU" ) {
		focusOnProductField( ".inventory_tab", "_sku" );
		return;
	}

	if ( id === "productIdentifier" ) {
		focusOnProductField( ".yoast_tab_tab", "yoast_identifier_gtin8" );
	}
}

/**
 * Adds the code to focus on the input buttons on the product-specific assessments.
 *
 * @returns {void}
 */
export default function initializeInputFocus() {
	addAction( "yoast.focus.input", "yoast/wpseo-woocommerce/inputFocus", inputFocus );
}
