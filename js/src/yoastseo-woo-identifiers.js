/* global jQuery, YoastSEO, wpseoWooIdentifiers, wpseoWooSKU */
import { addFilter } from "@wordpress/hooks";

const identifierKeys = [
	"gtin8",
	"gtin12",
	"gtin13",
	"gtin14",
	"isbn",
	"mpn",
];

/**
 * Checks whether the product has a global identifier.
 *
 * @param {Object} product The product to check.
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function hasGlobalSKU( product ) {
	return product.sku !== "";
}

/**
 * Checks whether the product has an identifier
 *
 * @param {Object} product The product to check.
 *
 * @returns {boolean} Whether the product has an identifier.
 */
function hasGlobalIdentifier( product ) {
	return !! (
		product.productIdentifiers.gtin8 ||
		product.productIdentifiers.gtin12 ||
		product.productIdentifiers.gtin13 ||
		product.productIdentifiers.gtin14 ||
		product.productIdentifiers.isbn ||
		product.productIdentifiers.mpn
	);
}

/**
 * Checks whether there are any variants.
 *
 * @param {Object[]} productVariants The product variants.
 *
 * @returns {Boolean} Whether there are available variants.
 */
function hasVariants( productVariants ) {
	return productVariants.length >= 1;
}

/**
 * Checks whether or not all variants have at least one identifier set.
 *
 * @param {Object[]} productVariants The product variants.
 *
 * @returns {Boolean} Whether or not all variants have at least one identifier set.
 */
function doAllVariantsHaveIdentifier( productVariants ) {
	return productVariants.every( hasGlobalIdentifier );
}

/**
 * Checks whether or not all variants have SKU.
 *
 * @param {Object[]} productVariants The product variants.
 *
 * @returns {Boolean} Whether all variants have SKU.
 */
function doAllVariantsHaveSkus( productVariants ) {
	return productVariants.every( variant => variant.sku );
}

/**
 * Gets the initial product data needed for the SKU and product identifier assessments
 * for the variant with the given ID from the JavaScript object injected by the server.
 *
 * @param {string} id The product variant ID.
 *
 * @returns {Object} The initial product data needed for the SKU and product identifier assessments (for the variant with the given ID).
 */
function getInitialProductVariant( id ) {
	return {
		id,
		hasPrice: wpseoWooIdentifiers.available_variations.includes( parseInt( id, 10 ) ),
		sku: wpseoWooSKU.variations[ id ],
		productIdentifiers: wpseoWooIdentifiers.variations[ id ],
	};
}

/**
 * Gets the product data needed for the SKU and product identifier assessments
 * of all product variants from the page.
 *
 * @returns {Object[]} The product data needed for the SKU and product identifier assessments of all product variants.
 */
function getProductVariants() {
	const variationElements = [ ...document.querySelectorAll( ".woocommerce_variation" ) ];

	if ( variationElements.length === 0 ) {
		// WooCommerce variations are not loaded yet, so try to use the initial data.
		return Object.keys( wpseoWooIdentifiers.variations ).map( getInitialProductVariant );
	}

	return variationElements.map(
		element => {
			const id = element.querySelector( "input.variable_post_id" ).value;
			const price = element.querySelector( "input.wc_input_price" ).value;
			const sku = element.querySelector( "input[id^=variable_sku]" ).value;

			const gtin8 = element.querySelector( `#yoast_variation_identifier\\[${id}\\]\\[gtin8\\]` ).value;
			const gtin12 = element.querySelector( `#yoast_variation_identifier\\[${id}\\]\\[gtin12\\]` ).value;
			const gtin13 = element.querySelector( `#yoast_variation_identifier\\[${id}\\]\\[gtin13\\]` ).value;
			const gtin14 = element.querySelector( `#yoast_variation_identifier\\[${id}\\]\\[gtin14\\]` ).value;
			const mpn = element.querySelector( `#yoast_variation_identifier\\[${id}\\]\\[mpn\\]` ).value;

			return {
				id,
				hasPrice: !! price,
				sku,
				productIdentifiers: { gtin8, gtin12, gtin13, gtin14, mpn },
			};
		}
	);
}

/**
 * Gets the initial product data needed for the SKU and product identifier assessments
 * from the JavaScript object injected by the server.
 *
 * @returns {Object} The initial product data needed for the SKU and product identifier assessments.
 */
function getInitialProductData() {
	return {
		sku: wpseoWooSKU.global_sku,
		productIdentifiers: wpseoWooIdentifiers.global_identifier_values,
	};
}

/**
 * Get the product data needed for the SKU and product identifier assessments
 * from the editor.
 *
 * @returns {Object} The product data needed for the SKU and product identifier assessments.
 */
function getProductData() {
	const sku = document.querySelector( "input#_sku" ).value;

	const gtin8 = document.getElementById( "yoast_identifier_gtin8" ).value;
	const gtin12 = document.getElementById( "yoast_identifier_gtin12" ).value;
	const gtin13 = document.getElementById( "yoast_identifier_gtin13" ).value;
	const gtin14 = document.getElementById( "yoast_identifier_gtin14" ).value;
	const isbn = document.getElementById( "yoast_identifier_isbn" ).value;
	const mpn = document.getElementById( "yoast_identifier_mpn" ).value;

	const data = {
		sku,
		productIdentifiers: {
			gtin8,
			gtin12,
			gtin13,
			gtin14,
			isbn,
			mpn,
		},
	};

	return Object.assign( {}, getInitialProductData(), data );
}

/**
 * Callback function for the "yoast.analysis.data" filter. Adds data required for the product identifiers assessment.
 *
 * @param {Object} data The data passed to the analysis.
 *
 * @returns {Object} The data enriched with data on identifiers.
 */
function enrichDataWithIdentifiers( data ) {
	const newData = { ...data };
	if ( ! newData.hasOwnProperty( "customData" ) ) {
		newData.customData = {};
	}

	const product = getProductData();
	const productVariants = getProductVariants();

	// Only check whether product variants that have a price have the necessary SKU and product identifiers.
	const variantsWithPrice = productVariants.filter( variant => variant.hasPrice );

	newData.customData = Object.assign( newData.customData, {
		hasGlobalIdentifier: hasGlobalIdentifier( product ),
		hasVariants: hasVariants( variantsWithPrice ),
		doAllVariantsHaveIdentifier: doAllVariantsHaveIdentifier( variantsWithPrice ),
		hasGlobalSKU: hasGlobalSKU( product ),
		doAllVariantsHaveSKU: doAllVariantsHaveSkus( variantsWithPrice ),
	} );

	return newData;
}

/**
 * A function that registers event listeners.
 *
 * @returns {void}.
 */
function registerEventListeners() {
	// Register event listeners for the global identifier inputs (non-variation);
	identifierKeys.forEach( key => {
		const globalIdentifierInput = document.getElementById( `yoast_identifier_${ key }` );
		globalIdentifierInput.addEventListener( "change", YoastSEO.app.refresh );
	} );

	// Register event listeners for the global sku input from Woocommerce (non-variation);
	const globalSkuInput = document.getElementById( "_sku" );
	globalSkuInput.addEventListener( "change", YoastSEO.app.refresh );

	// Listen for changes in the WooCommerce variations (e.g. adding or removing variations).
	const variationsObserver = new MutationObserver( YoastSEO.app.refresh );
	variationsObserver.observe( document.querySelector( ".woocommerce_variations" ), { childList: true } );

	// Detect changes in the price inputs and handle them.
	jQuery( document.body ).on(
		"change",
		"#variable_product_options .woocommerce_variations :input[id^=variable_regular_price]",
		YoastSEO.app.refresh
	);

	// Detect changes in the variation product identifiers and handle them.
	jQuery( document.body ).on(
		"change", "#variable_product_options .woocommerce_variations :input[id^=yoast_variation_identifier]",
		YoastSEO.app.refresh
	);

	// Detect changes in the variation SKU identifiers and handle them.
	jQuery( document.body ).on(
		"change", "#variable_product_options .woocommerce_variations :input[id^=variable_sku]",
		YoastSEO.app.refresh
	);
}

/**
 * Initializes the code that listens for SKU and product identifier changes
 * on the WooCommerce product in the editor, and sends this data over to the
 * SEO analysis.
 *
 * @returns {void}
 */
function initializeGlobalIdentifierScripts() {
	// When YoastSEO is available, just instantiate the scripts.
	if ( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
		addFilter( "yoast.analysis.data", "wpseo-woocommerce-identifier-data", enrichDataWithIdentifiers );
		registerEventListeners();
		return;
	}

	// Otherwise, add an event that will be executed when YoastSEO will be available.
	jQuery( window ).on(
		"YoastSEO:ready",
		function() {
			addFilter( "yoast.analysis.data", "wpseo-woocommerce-identifier-data", enrichDataWithIdentifiers );
			registerEventListeners();
		}
	);
}

initializeGlobalIdentifierScripts();
