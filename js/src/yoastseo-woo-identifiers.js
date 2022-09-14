/* global jQuery, YoastSEO, wpseoWooIdentifiers, wpseoWooSKU */
import { addFilter } from "@wordpress/hooks";
import { uniqBy } from "lodash-es";

const identifierKeys = [
	"gtin8",
	"gtin12",
	"gtin13",
	"gtin14",
	"isbn",
	"mpn",
];

let canRetrieveVariantSkus = true;
let canRetrieveAllVariantIdentifiers = true;

/**
 * Cached product variants data.
 *
 * @type {Object[]}
 */
let productVariantsData = [];

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
		sku: wpseoWooSKU.variations[ id ],
		productIdentifiers: wpseoWooIdentifiers.variations[ id ],
	};
}

/**
 * Gets the product identifiers from the identifier input field elements. If an element is not found, the identifier
 * is assigned to an empty string.
 *
 * @param {HTMLElement[]}	identifierInputFieldElements	The HTML elements for the identifier input fields.
 *
 * @returns {Object} The product identifiers.
 */
function getIdentifiers( identifierInputFieldElements ) {
	/*
	 * Create an array with the product identifiers based on the input fields.
	 * If the input field is null, the product identifier is set to an empty string.
	 * Otherwise, it is set to the value of the element.
	*/
	const productIdentifiersArray = [];
	identifierInputFieldElements.forEach( ( inputField ) => {
		if ( inputField === null ) {
			productIdentifiersArray.push( "" );
		} else {
			productIdentifiersArray.push( inputField.value );
		}
	} );

	// Assign the identifiers to an object. Trim the values so that we don't recognize identifiers with only spaces as valid.
	return {
		gtin8: productIdentifiersArray[ 0 ].trim(),
		gtin12: productIdentifiersArray[ 1 ].trim(),
		gtin13: productIdentifiersArray[ 2 ].trim(),
		gtin14: productIdentifiersArray[ 3 ].trim(),
		isbn: productIdentifiersArray[ 4 ].trim(),
		mpn: productIdentifiersArray[ 5 ].trim(),
	};
}

/**
 * Get the product variants, as initialized on page load.
 *
 * @returns {Object[]} The initial product variants.
 */
function getInitialProductVariants() {
	return Object.keys( wpseoWooIdentifiers.variations ).map( getInitialProductVariant );
}

/**
 * Get the product variant data from the given element.
 *
 * @param {HTMLElement} element The element from which to get the data.
 *
 * @returns {Object} The product variant data.
 */
function getProductVariant( element ) {
	const id = element.querySelector( "input.variable_post_id" ).value;

	const skuElement = element.querySelector( "input[id^=variable_sku]" );
	let sku = "";

	if ( skuElement ) {
		sku = skuElement.value;
	} else {
		canRetrieveVariantSkus = false;
	}

	// Create an array with the product identifier input field elements.
	const identifierElementIds = [
		`#yoast_variation_identifier\\[${id}\\]\\[gtin8\\]`,
		`#yoast_variation_identifier\\[${id}\\]\\[gtin12\\]`,
		`#yoast_variation_identifier\\[${id}\\]\\[gtin13\\]`,
		`#yoast_variation_identifier\\[${id}\\]\\[gtin14\\]`,
		`#yoast_variation_identifier\\[${id}\\]\\[gtin14\\]`,
		`#yoast_variation_identifier\\[${id}\\]\\[mpn\\]`,
	];
	const identifierInputFieldElements = identifierElementIds.map( elementId => element.querySelector( elementId ) );

	// If some of the input field elements are null, change canRetrieveAllVariantIdentifiers to false.
	if ( identifierInputFieldElements.some( ( inputField ) => inputField === null ) ) {
		canRetrieveAllVariantIdentifiers = false;
	}

	return {
		id,
		sku: sku.trim(),
		productIdentifiers: getIdentifiers( identifierInputFieldElements ),
	};
}

/**
 * Caches product variants and makes sure that every variant can be assessed,
 * even if they are not loaded on the current page of variations.
 *
 * @param {Array} productVariants The product variants on the current page of variations.
 *
 * @returns {Array} The product variants, including changes of variants from other pages.
 */
function cacheProductVariants( productVariants ) {
	const variationsParentElement = document.querySelector( ".woocommerce_variations" );
	// Do not cache if no product variants have been found.
	if ( productVariants.length === 0 && variationsParentElement ) {
		const numberOfVariations = variationsParentElement.getAttribute( "data-total" );

		// If there are variants but they are not available in the DOM, get the variant data from the JS object.
		if ( numberOfVariations > 0 ) {
			return Object.keys( wpseoWooIdentifiers.variations ).map( getInitialProductVariant );
		}
		// If there are no variants, return empty array, and remove the cache.
		productVariantsData = [];
	} else if ( productVariants < productVariantsData ) {
		// We shouldn't save the cache when a product variant(s) is removed.
		productVariantsData = productVariants;
	} else {
		productVariantsData = uniqBy( [
			...productVariants,
			...productVariantsData,
			...getInitialProductVariants(),
		], variant => variant.id );
	}

	return productVariantsData;
}

/**
 * Gets the product data needed for the SKU and product identifier assessments
 * of all product variants from the page.
 *
 * @returns {Object[]} The product data needed for the SKU and product identifier assessments of all product variants.
 */
function getProductVariants() {
	const variationElements = [ ...document.querySelectorAll( ".woocommerce_variation" ) ];
	const productVariants = variationElements.map( getProductVariant );
	return cacheProductVariants( productVariants );
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
	let canRetrieveGlobalSku = true;
	let canRetrieveAllIdentifiers = true;

	/*
	 * Only get the value of the SKU input element if the element can be found.
	 * If it can't be found, change the the value of canRetrieveGlobalSku to false.
	*/
	let sku = "";
	const skuInputField = document.querySelector( "input#_sku" );
	if ( skuInputField ) {
		sku = skuInputField.value;
	} else {
		canRetrieveGlobalSku = false;
	}

	// Create an array with the product identifier input field elements.
	const identifierElementIds = [ "yoast_identifier_gtin8", "yoast_identifier_gtin12", "yoast_identifier_gtin13",
		"yoast_identifier_gtin14", "yoast_identifier_isbn", "yoast_identifier_mpn" ];
	const identifierInputFieldElements = identifierElementIds.map( elementId => document.getElementById( elementId ) );

	// If some of the input field elements are null, change canRetrieveAllIdentifiers to false.
	if ( identifierInputFieldElements.some( ( inputField ) => inputField === null ) ) {
		canRetrieveAllIdentifiers = false;
	}

	const productType = document.querySelector( "select#product-type" ).value;

	const data = {
		canRetrieveGlobalSku,
		canRetrieveAllIdentifiers,
		sku: sku.trim(),
		productType: productType,
		productIdentifiers: getIdentifiers( identifierInputFieldElements ),
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

	// Get product identifier data.
	const productHasGlobalIdentifier = hasGlobalIdentifier( product );
	const allVariantsHaveIdentifier = doAllVariantsHaveIdentifier( productVariants );
	/*
	 * Only set canRetrieveGlobalIdentifier and canRetrieveVariantIdentifiers to false if at least one identifier
	 * could not be retrieved AND no identifier was found for the product/for all variants. If an identifier was
	 * found, it doesn't matter if potentially other of the identifier fields cannot be retrieved.
	*/
	const canRetrieveGlobalIdentifier = productHasGlobalIdentifier ||
		! productHasGlobalIdentifier && product.canRetrieveAllIdentifiers === true;

	const canRetrieveVariantIdentifiers = allVariantsHaveIdentifier ||
		! allVariantsHaveIdentifier && canRetrieveAllVariantIdentifiers === true;

	newData.customData = Object.assign( newData.customData, {
		canRetrieveGlobalIdentifier: canRetrieveGlobalIdentifier,
		canRetrieveVariantIdentifiers: canRetrieveVariantIdentifiers,
		canRetrieveGlobalSku: product.canRetrieveGlobalSku,
		canRetrieveVariantSkus: canRetrieveVariantSkus,
		productType: product.productType,
		hasGlobalIdentifier: productHasGlobalIdentifier,
		hasVariants: hasVariants( productVariants ),
		doAllVariantsHaveIdentifier: allVariantsHaveIdentifier,
		hasGlobalSKU: hasGlobalSKU( product ),
		doAllVariantsHaveSKU: doAllVariantsHaveSkus( productVariants ),
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
	if ( globalSkuInput ) {
		globalSkuInput.addEventListener( "change", YoastSEO.app.refresh );
	}

	// Detect changes in the product type.
	const productTypeInput = document.querySelector( "select#product-type" );
	// ProductType.addEventListener( "change", YoastSEO.app.refresh );
	productTypeInput.addEventListener( "change", YoastSEO.app.refresh );

	// Listen for changes in the WooCommerce variations (e.g. adding or removing variations).
	const variationsObserver = new MutationObserver( YoastSEO.app.refresh );
	variationsObserver.observe( document.getElementById( "variable_product_options" ),  { childList: true, subtree: true, attributes: true } );

	// Detect changes in the variation product identifiers and handle them.
	jQuery( document.body ).on(
		"change", "#variable_product_options .woocommerce_variations :input[id^=yoast_variation_identifier]",
		YoastSEO.app.refresh
	);

	if ( canRetrieveVariantSkus ) {
		// Detect changes in the variation SKU identifiers and handle them.
		jQuery( document.body ).on(
			"change", "#variable_product_options .woocommerce_variations :input[id^=variable_sku]",
			YoastSEO.app.refresh
		);
	}
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
