/* global jQuery, YoastSEO, wpseoWooIdentifiers, wpseoWooSKU */
import { addFilter } from "@wordpress/hooks";
import { setWith, merge } from "lodash-es";

const identifierKeys = [
	"gtin8",
	"gtin12",
	"gtin13",
	"gtin14",
	"isbn",
	"mpn",
];

const SKUIdentifier = "sku";
const SKUWooIdentifier = "_sku";

let identifiersStore = merge( {}, wpseoWooIdentifiers || {} );
let skuStore = merge( {}, wpseoWooSKU || {} );

// Store to keep track of the deletion process for a single variation.
let candidateForDeletion = "";

// Store to keep track of whether identifiersStore can be trusted or should be reloaded.
let variantIdentifierDataIsValid = true;

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function hasGlobalSKU() {
	return skuStore.global_sku !== "";
}

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function hasGlobalIdentifier() {
	return Object.values( identifiersStore.global_identifier_values ).some( identifier => identifier !== "" );
}

/**
 * A function to calculate whether there are any variants.
 *
 * @returns {Boolean} Whether there are available variants.
 */
function hasVariants() {
	return identifiersStore.available_variations.length > 0;
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
	const allVariantsHaveIdentifier = identifiersStore.available_variations.every(
		availableVariationId => {
			const variation = identifiersStore.variations[ availableVariationId ];
			// Return true if at least one identifier is set.
			return Object.values( variation ).some( variationIdentifier => variationIdentifier !== "" );
		}
	);
	return allVariantsHaveIdentifier;
}

/**
 * A function to calculate whether or not all variants have at least one identifier set.
 *
 * @returns {Boolean} Whether or not all variants have at least one identifier set.
 */
function doAllVariantsHaveSkus() {
	if ( ! hasVariants() ) {
		return false;
	}

	// Gather all available variations, make sure their sku is a non-zero string.
	return skuStore.available_variations.every(
		availableVariationId => skuStore.variations[ availableVariationId ].length > 0
	);
}

/**
 * A function that checks whether the identifier data can still be trusted.
 *
 * @returns {Boolean} Whether the identifier data can still be trusted.
 */
function isVariantIdentifierDataValid() {
	return variantIdentifierDataIsValid;
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
	if ( ! Object.hasOwnProperty( newData, "customData" ) ) {
		newData.customData = {};
	}
	newData.customData = Object.assign( newData.customData, {
		hasGlobalIdentifier: hasGlobalIdentifier(),
		hasVariants: hasVariants(),
		doAllVariantsHaveIdentifier: doAllVariantsHaveIdentifier(),
		variantIdentifierDataIsValid: isVariantIdentifierDataValid(),

		hasGlobalSKU: hasGlobalSKU(),
		doAllVariantsHaveSKU: doAllVariantsHaveSkus(),
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
	const [ variantIdString, identifierKey ] = inputId.match( /(?<=\[)(.*?)(?=\])/g );
	const variantId = parseInt( variantIdString, 10 );

	// Create a mock object to merge with the identifiersStore (to avoid referencing issues).
	const newVariations = setWith( {}, `variations[${ variantId }][${ identifierKey }]`, event.target.value, Object );
	identifiersStore = merge( {}, identifiersStore, newVariations );

	// Refresh the app so the analysis runs.
	YoastSEO.app.refresh();
}

/**
 * Handles changes to the SKU fields that are in the dom after "variations loaded".
 *
 * @param {Event} event Change event
 *
 * @returns {void}
 */
function handleSkuChange( event ) {
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
 * Manipulates a specific store to update variations when an specific value is changed.
 *
 * @param {Object} store The store to update.
 * @param {boolean} shouldRefresh If the YoastSEO app should be reloaded after the change.
 * @param {int} changedId The variation id that is changed.
 * @param {string|int} newValue The value it is changed into.
 * @returns {boolean} if the app should be updated.
 */
function updateStore( store, shouldRefresh, changedId, newValue ) {
	// If the price was changed for an id that we don't know about, add the id to the variations store.
	if ( ! Object.keys( store.variations ).includes( `${ changedId }` ) ) {
		store.variations[ changedId ] = {};
	}

	if ( newValue === "" ) {
		/* eslint-disable-next-line camelcase */
		store.available_variations = store.available_variations.filter( id => changedId !== id );
		shouldRefresh = true;
	} else if ( ! store.available_variations.includes( changedId ) ) {
		// If it's a new id that receives a price, add it to available variations.
		store.available_variations.push( changedId );
		shouldRefresh = true;
	}

	return shouldRefresh;
}


/**
 * Manipulates the store accordingly when there is a price change.
 *
 * @param {Event} event A change event.
 *
 * @returns {void}
 */
function handlePriceChange( event ) {
	// Get the id of the changed variation
	const idElement = jQuery( event.target ).parents( ".woocommerce_variations .woocommerce_variation" ).find( "h3 strong" )[ 0 ];
	const changedId = parseInt( idElement.innerText.substring( 1 ), 10 );
	const newValue = event.target.value;
	let shouldRefresh = false;

	shouldRefresh = updateStore( identifiersStore, shouldRefresh, changedId, newValue );
	shouldRefresh = updateStore( skuStore, shouldRefresh, changedId, newValue );

	if ( shouldRefresh ) {
		// Refresh the app so the analysis runs.
		YoastSEO.app.refresh();
	}
}


/**
 * A function that registers event listeners.
 *
 * @returns {void}.
 */
function registerEventListeners() {
	/*
	 Store bulk action in order to know what has happened when the variations block gets loaded again.
	 We don't know what value the customer put in, and we don't know whether they've cancelled or not.
	 */
	jQuery( ".wc-metaboxes-wrapper" ).on( "click", "a.do_variation_action", () => {
		// User is trying to "go" for the following bulk action:
		const attemptedBulkACtion = jQuery( ".variation_actions" )[ 0 ].value;
		if ( [
			"variable_regular_price",
			"variable_regular_price_increase",
			"variable_regular_price_decrease",
			"delete_all",
		].includes( attemptedBulkACtion ) ) {
			// We cannot guarantee data integrity because we don't know what the user decided, so we are asking for a reload.
			variantIdentifierDataIsValid = false;
			YoastSEO.app.refresh();
		}
	} );

	// If a user is trying to delete a variation, note the ID of the variant being removed.
	jQuery( "#variable_product_options" ).on( "click", ".remove_variation", ( event ) => {
		if ( event.target && event.target.rel ) {
			candidateForDeletion = event.target.rel;
		}
	} );

	// If "variations_removed" is called, see if we knew about a variant that was going to be deleted.
	jQuery( "#woocommerce-product-data" ).on( "woocommerce_variations_removed", () => {
		if ( candidateForDeletion === "" ) {
			return;
		}

		// Remove the variation that was the candidate to delete.
		const newAvailableVariations = identifiersStore.available_variations.filter( id => parseInt( candidateForDeletion, 10 ) !== id );
		/* eslint-disable-next-line camelcase */
		identifiersStore.available_variations = newAvailableVariations;
		candidateForDeletion = "";

		// Refresh the app so the analysis runs.
		YoastSEO.app.refresh();
	} );

	// Detecht changes in the price inputs and handle them.
	jQuery( document.body ).on( "change", "#variable_product_options .woocommerce_variations :input[id^=variable_regular_price]", handlePriceChange );

	// Detect changes in the variation identifiers and handle them.
	jQuery( document.body ).on(
		"change", "#variable_product_options .woocommerce_variations :input[id^=yoast_variation_identifier]",
		handleVariationIdentifierChange
	);

	// Detect changes in the variation identifiers and handle them.
	jQuery( document.body ).on(
		"change", `#variable_product_options .woocommerce_variations :input[id^=variable${ SKUWooIdentifier }]`,
		handleSkuChange
	);

	// Register event listeners for the global identifier inputs (non-variation);
	identifierKeys.forEach( key => {
		const globalIdentifierInput = document.getElementById( `yoast_identfier_${ key }` );
		globalIdentifierInput.addEventListener( "change", ( event ) => {
			const newValue = event.target.value;

			// Create a mock object to merge with the identifiersStore (to avoid referencing issues).
			const newGlobalIdentifierValue = setWith( {}, `global_identifier_values.${ key }`, newValue );
			identifiersStore = merge( {}, identifiersStore, newGlobalIdentifierValue );

			// Refresh the app so the analysis runs.
			YoastSEO.app.refresh();
		} );
	} );

	// Register event listeners for the global sku input from Woocommerce (non-variation);
	const globalSkuInput = document.getElementById( SKUWooIdentifier );
	globalSkuInput.addEventListener( "change", ( event ) => {
		const newValue = event.target.value;

		// Create a mock object to merge with the identifiersStore (to avoid referencing issues).
		const newGlobalIdentifierValue = setWith( {}, "global_sku", newValue );
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
