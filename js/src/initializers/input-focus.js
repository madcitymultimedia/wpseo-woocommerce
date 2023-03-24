import { addAction } from "@wordpress/hooks";
import { getProductData, getProductVariants } from "../yoastseo-woo-identifiers";
import { get } from "lodash-es";

/**
 * Opens WooCommerce panel if it is closed.
 *
 * @returns {void}
 */
function openWoocommerce() {
	const postboxData = document.querySelector( "#woocommerce-product-data" );
	if ( ! postboxData ) {
		return;
	}

	if ( postboxData.classList.contains( "closed" ) ) {
		postboxData.classList.remove( "closed" );
	}
}

/**
 * Opens WooCommerce tab.
 *
 * @param {string} tabSelector The tab selector.
 * @returns {void}
 */
function openWoocommerceTab( tabSelector ) {
	// Open the WooCommerce tab
	const tabLink = document.querySelector( tabSelector + " a" );
	if ( ! tabLink ) {
		return;
	}
	tabLink.click();
}
/**
 * Opens a WooCommerce tab and then focuses on a Product input field.
 *
 * @param {string} tabSelector The tab selector.
 * @param {string} fieldID The input field ID.
 * @returns {void}
 */
function focusOnProductField( tabSelector, fieldID ) {
	openWoocommerce();

	openWoocommerceTab( tabSelector );

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
 * @param {Object[]} variations the list of product variations.
 * @param {string} emptyFieldPath The path of the field that will be checked if it's empty.
 * @param {string} fieldID The input field ID.
 * @returns {void}
 */
function focusOnVariationProductField( variations, emptyFieldPath, fieldID ) {
	openWoocommerce();

	openWoocommerceTab( ".variations_tab" );

	// Find the first identifier without a SKU.
	const index = variations.findIndex( ( element ) => get( element, emptyFieldPath ) === "" );

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
		const element = variationDiv.querySelector( fieldID );
		if ( ! element ) {
			return;
		}
		element.focus();
		element.scrollIntoView( false );
	}

	// Wait for the variations tab to open and then open up the first variation without a SKU.
	setTimeout( () => handle( index ), 1000 );
}

/**
 * Focuses on the product field.
 * @param {string} id The id of the assessment.
 * @returns {void}
 */
function focusInputField( id ) {
	const productData = getProductData();

	if ( productData.productType === "variable" ) {
		const variations = getProductVariants();

		if ( id === "productSKU" ) {
			if ( variations && variations.length > 0 ) {
				focusOnVariationProductField( variations, "sku",  "[id^='variable_sku']" );
			} else {
				focusOnProductField( ".inventory_tab", "_sku" );
			}
			return;
		}

		if ( id === "productIdentifier" ) {
			if ( variations && variations.length > 0 ) {
				focusOnVariationProductField( variations, "productIdentifiers.gtin8", "[id^='yoast_variation_identifier']" );
			} else {
				focusOnProductField( ".yoast_tab_tab", "yoast_identifier_gtin8" );
			}
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
	addAction( "yoast.focus.input", "yoast/wpseo-woocommerce/inputFocus", focusInputField );
}
