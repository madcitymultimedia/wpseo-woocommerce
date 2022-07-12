/* global jQuery, YoastSEO, wpseoWooIdentifiers */
import { addFilter } from "@wordpress/hooks";

const identifierKeys = [
	"gtin8",
	"gtin12",
	"gtin13",
	"gtin14",
	"isbn",
	"mpn",
];

let identifiersStore = wpseoWooIdentifiers || {};

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
 * @returns {Boolean} Whether or not all variants have at least one identifier set.
 */
function hasVariants() {
	return Object.keys( identifiersStore.variations ).length > 0;
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
	const allVariantsHaveIdentifier = Object.values( identifiersStore.variations ).every(
		variation => {
			// Return true if at least one identifier is set.
			return Object.values( variation ).some( variationIdentifier => variationIdentifier !== "" );
		}
	);
	return allVariantsHaveIdentifier;
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
	newData.customData = {
		hasGlobalIdentifier: hasGlobalIdentifier(),
		hasVariants: hasVariants(),
		doAllVariantsHaveIdentifier: doAllVariantsHaveIdentifier(),
	};

	return newData;
}

/**
 * A function that registers event listeners.
 *
 * @returns {void}.
 */
function registerEventListeners() {
	let variationIds = [];
	if ( wpseoWooIdentifiers.variations ) {
		variationIds = Object.keys( wpseoWooIdentifiers.variations );
	}

	/*
	Still to do: Add event to add variations if they receive a price or something, anything that could make them be output by product->get_available_variations...
	*/

	jQuery( "#woocommerce-product-data" ).on( "woocommerce_variations_loaded", () => {
		identifierKeys.forEach( key => {
			variationIds.forEach( ( variationId ) => {
				const variationInput = document.getElementById( `yoast_variation_identifier[${ variationId }][${ key }]` );
				if ( variationInput ) {
					variationInput.addEventListener( "change", ( event ) => {
						const newValue = event.target.value;
						identifiersStore = Object.assign( {}, identifiersStore, { variations: {
							...identifiersStore.variations,
							[ variationId ]: {
								...identifiersStore.variations[ variationId ],
								[ key ]: newValue,
							},
						} } );

						// Refresh the app so the analysis runs.
						YoastSEO.app.refresh();
					} );
				}
			} );
		} );
	} );

	identifierKeys.forEach( key => {
		const globalIdentifierInput = document.getElementById( `yoast_identfier_${ key }` );
		globalIdentifierInput.addEventListener( "change", ( event ) => {
			const newValue = event.target.value;
			/* eslint-disable-next-line camelcase */
			identifiersStore = Object.assign( {}, identifiersStore, { global_identifier_values: {
				...identifiersStore.global_identifier_values,
				[ key ]: newValue,
			} } );

			// Refresh the app so the analysis runs.
			YoastSEO.app.refresh();
		} );
	} );

	/*
	Still to do:
	Calculate initial custom data for the paper from the window object wpseoWooIdentifiers,
	add the custom data to the filter,
	trigger refresh???? Or perhaps tie in to the initialize if that exists somehow.
	*/
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
