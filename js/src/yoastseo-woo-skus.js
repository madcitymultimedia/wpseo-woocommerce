/* global jQuery, YoastSEO, wpseoWooSKU */
import { addFilter } from "@wordpress/hooks";
import { setWith, merge } from "lodash-es";

const SKUIdentifier = "sku";
const SKUWooIdentifier = "_sku";

let skuStore = merge( {}, wpseoWooSKU || {} );

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function hasGlobalSKU() {
	return Object.values( skuStore.global_sku ).some( identifier => identifier !== "" );
}

/**
 * A function to calculate whether there are any variants.
 *
 * @returns {Boolean} Whether there are available variants.
 */
function hasVariants() {
	return skuStore.available_variations.length > 0;
}

/**
 * A function to calculate whether or not all variants have at least one identifier set.
 *
 * @returns {Boolean} Whether or not all variants have at least one identifier set.
 */
function doAllVariantsHaveIdentifier() {
	if ( ! hasVariants() ) {
		return false;
	}

	// Gather all identifier objects for each variation. Make sure each has at least one non-empty identifier.
	return skuStore.available_variations.every(
		availableVariationId => {
			const variation = skuStore.variations[ availableVariationId ];
			// Return true if at least one identifier is set.
			return Object.values( variation ).some( variationIdentifier => variationIdentifier !== "" );
		}
	);
}

/**
 * Callback function for the "yoast.analysis.data" filter. Adds data required for the product sku assessment.
 *
 * @param {Object} data The data passed to the analysis.
 *
 * @returns {Object} The data enriched with data on identifiers.
 */
function enrichDataWithIdentifiers( data ) {
	const newData = { ...data };
	if ( ! Object.hasOwnProperty( newData, "customData" ) ) {
		newData.customData = {};
	}
	newData.customData = Object.assign( newData.customData, {
		hasGlobalSKU: hasGlobalSKU(),
		hasVariants: hasVariants(),
		doAllVariantsHaveSKU: doAllVariantsHaveIdentifier(),
	} );

	return newData;
}

/**
 * Handles changes to the variation identifier fields that are in the dom after "variations loaded".
 *
 * @param {Event} event Change event
 *
 * @returns {void}
 */
function handleVariationIdentifierChange( event ) {
	const inputId = event.target.id;
	const [ nthSkuInput ] = inputId.match( /\d+/g );
	const variationId = Object.keys( skuStore.variations )[ nthSkuInput ];

	// Create a mock object to merge with the identifiersStore (to avoid referencing issues).
	const newVariations = setWith( {}, `variations[${ variationId }]`, event.target.value, Object );
	skuStore = merge( {}, skuStore, newVariations );

	// Refresh the app so the analysis runs.
	YoastSEO.app.refresh();
}

/**
 * A function that registers event listeners.
 *
 * @returns {void}.
 */
function registerEventListeners() {
	// Detect changes in the variation identifiers and handle them.
	jQuery( document.body ).on(
		"change", `#variable_product_options .woocommerce_variations :input[id^=variable${ SKUWooIdentifier }]`,
		handleVariationIdentifierChange
	);

	// Register event listeners for the global sku input from Woocommerce (non-variation);
	const globalIdentifierInput = document.getElementById( SKUWooIdentifier );
	globalIdentifierInput.addEventListener( "change", ( event ) => {
		const newValue = event.target.value;

		// Create a mock object to merge with the identifiersStore (to avoid referencing issues).
		const newGlobalIdentifierValue = setWith( {}, `global_sku.${ SKUIdentifier }`, newValue );
		skuStore = merge( {}, skuStore, newGlobalIdentifierValue );

		// Refresh the app so the analysis runs.
		YoastSEO.app.refresh();
	} );
}

/**
 * Registers the global replacevar events.
 *
 * @returns {void}
 */
function initializeGlobalSkuScripts() {
	// When YoastSEO is available, just instantiate the scripts.
	if ( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
		addFilter( "yoast.analysis.data", "wpseo-woocommerce-sku-data", enrichDataWithIdentifiers );
		registerEventListeners();
		return;
	}

	// Otherwise, add an event that will be executed when YoastSEO will be available.
	jQuery( window ).on(
		"YoastSEO:ready",
		function() {
			addFilter( "yoast.analysis.data", "wpseo-woocommerce-sku-data", enrichDataWithIdentifiers );
			registerEventListeners();
		}
	);
}

initializeGlobalSkuScripts();
