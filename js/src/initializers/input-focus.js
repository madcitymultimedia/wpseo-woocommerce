import { addAction } from "@wordpress/hooks";
import { getProductData, getProductVariants } from "../yoastseo-woo-identifiers";

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
 * Opens a WooCommerce tab for a variation and then focuses on a Product input field.
 *
 * @param {string} fieldID The input field ID.
 * @returns {void}
 */
function focusOnVariationProductField( fieldID ) {
	// Open the WooCommerce variations tab
	const tabLink = document.querySelector( ".variations_tab a" );
	if ( ! tabLink ) {
		return;
	}
	tabLink.click();

	// Retrieve the first identifier without a SKU.
	const variations = getProductVariants();
	const index = variations.findIndex( ( element ) => element.sku === "" );

	/**
	 * Handles the focusing of the field inside the variation.
	 *
	 * @param {string} variationIndex The index of the variation.
	 * @returns {void}
	 */
	function handle( variationIndex ) {
		const variationDiv = document.querySelectorAll( ".woocommerce_variation" )[ variationIndex ];
		if ( ! variationDiv.classList.contains( "open" ) ) {
			document.querySelectorAll( ".edit_variation" )[ variationIndex ].click();
		}

		// Focus on the element and scroll it into view.
		const element = document.getElementById( fieldID + variationIndex );
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

	// Wait for the variations tab to open and then open up the first variation without a SKU.
	setTimeout( () => handle( index ), 2000 );
}

/**
 * Focuses on the product field.
 * @param {string} id The id of the assessment.
 * @returns {void}
 */
function inputFocus( id ) {
	const productData = getProductData();

	if ( productData.productType === "variable" ) {
		if ( id === "productSKU" ) {
			focusOnVariationProductField( "variable_sku" );
			return;
		}

		if ( id === "productIdentifier" ) {
			// Does not work yet :-(
			focusOnVariationProductField( "yoast_identifier_gtin8" );
		}
	} else {
		if ( id === "productSKU" ) {
			focusOnProductField( ".inventory_tab", "_sku" );
			return;
		}

		if ( id === "productIdentifier" ) {
			focusOnProductField( ".yoast_tab_tab", "yoast_identifier_gtin8" );
		}
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
