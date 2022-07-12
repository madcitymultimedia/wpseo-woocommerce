/* global jQuery, wp, YoastSEO, wpseoWooIdentifiers */
import { addFilter, removeFilter } from "@wordpress/hooks";

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

function hasVariants() {
	const hasVariants = Object.keys( identifiersStore.variations ).length > 0;
	return hasVariants;
};

function doAllVariantsHaveIdentifier() {
	// Gather all identifier objects for each variation. Make sure each has at least one non-empty identifier.
	const allVariantsHaveIdentifier = Object.values( identifiersStore.variations ).every(
		variation => {
			// Return true if at least one identifier is set.
			return Object.values( variation ).some( variationIdentifier => variationIdentifier !== "" );
		}
	);
	return allVariantsHaveIdentifier;
};

/**
 * @returns {void}
 */
function sendAssessmentData() {
	const composedData = {
		hasGlobalIdentifier: hasGlobalIdentifier(),
		hasVariants: hasVariants(),
		doAllVariantsHaveIdentifier: doAllVariantsHaveIdentifier(),
	};

	removeFilter( "yoast.analysis.data", "wpseo-woocommerce-identifier-data" );
	addFilter( "yoast.analysis.data", "wpseo-woocommerce-identifier-data", data => {
		const newData = { ...data };
		newData.customData = composedData;
		return newData;
	} );
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

						sendAssessmentData();
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
			identifiersStore = Object.assign( {}, identifiersStore, { global_identifier_values: {
				...identifiersStore.global_identifier_values,
				[ key ]: newValue,
			} } );

			sendAssessmentData();
			YoastSEO.app.refresh();
		} );
	} );

	/*
	todo:
	calculate initial custom data for the paper from the window object wpseoWooIdentifiers,
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
	// When YoastSEO is available, just instantiate the plugin.
	if ( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
		registerEventListeners();
		return;
	}

	// Otherwise, add an event that will be executed when YoastSEO will be available.
	jQuery( window ).on(
		"YoastSEO:ready",
		function() {
			registerEventListeners();
		}
	);
}

initializeGlobalIdentifierScripts();
