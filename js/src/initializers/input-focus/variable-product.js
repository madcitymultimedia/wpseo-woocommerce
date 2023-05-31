import { openVariation, openWooCommerceTab, scrollToElement } from "./helpers";
import { getProductVariants } from "../woo-identifiers";

/**
 * Opens a WooCommerce tab for a variation and then focuses on the SKU field.
 *
 * @param {Number} variantIndex The index of the variant to focus on.
 * @returns {void}
 */
function focusOnSKUField( variantIndex ) {
	openWooCommerceTab( ".variations_tab" );

	/**
	 * Handles the focusing of the field inside the variation.
	 *
	 * @param {Number} variationIndex The index of the variation.
	 * @returns {void}
	 */
	function handle( variationIndex ) {
		const variationDiv = document.querySelectorAll( ".woocommerce_variation" )[ variationIndex ];
		openVariation( variationDiv, variationIndex );

		// Focus on the SKU input element.
		const element = variationDiv.querySelector( "[id^='variable_sku']" );
		element.focus();

		// Scroll it into view.
		scrollToElement( element, { top: -200 } );
	}

	// Wait for the variations tab to open and then open up the first variation without a SKU.
	setTimeout( () => handle( variantIndex ), 1000 );
}

/**
 * Checks if the given variation does not have a product identifier.
 *
 * @param {Object} variation The variation to check.
 * @returns {boolean} If the given variation does not have a product identifier.
 */
function hasNoProductIdentifier( variation ) {
	return Object.values( variation.productIdentifiers ).every( id => id === "" );
}

/**
 * Scrolls to the product identifiers for the variant with the given index.
 *
 * @param {Number} variantIndex The index of the variant to scroll to.
 *
 * @returns {void}
 */
function scrollToProductIdentifiers( variantIndex ) {
	openWooCommerceTab( ".variations_tab" );

	/**
	 * Scroll to the product variation with the given index.
	 *
	 * @param {Number} variationIndex The index of the variation to scroll to.
	 * @returns {void}
	 */
	function scrollToVariation( variationIndex ) {
		const variationDiv = document.querySelectorAll( ".woocommerce_variation" )[ variationIndex ];
		openVariation( variationDiv, variationIndex );

		const yoastSectionHeader = variationDiv.querySelector( "h1" );
		setTimeout( () => scrollToElement( yoastSectionHeader, { top: -200 } ), 200 );
	}

	setTimeout( () => scrollToVariation( variantIndex ), 1000 );
}

/**
 * Handles the input focus for variable products, e.g. after clicking the edit button next to an assessment.
 *
 * @param {string} id The ID of the assessment edit button that was clicked.
 *
 * @returns {void}
 */
function handleInputFocusForVariableProducts( id ) {
	const productVariants = getProductVariants();

	if ( id === "productSKU" ) {
		focusOnSKUField( productVariants.findIndex( element => element.sku === "" ) );
		return;
	}

	if ( id === "productIdentifier" ) {
		scrollToProductIdentifiers( productVariants.findIndex( hasNoProductIdentifier ) );
	}
}

export default handleInputFocusForVariableProducts;
