/* global jQuery, YoastSEO, wpseoWooIdentifiers */
import apiFetch from "@wordpress/api-fetch";
import { addFilter } from "@wordpress/hooks";
import { set, omit } from "lodash-es";

const identifierKeys = [
	"gtin8",
	"gtin12",
	"gtin13",
	"gtin14",
	"isbn",
	"mpn",
];

// Create an object based on the identifier keys, to fill new variations with.
const emptyVariationIdentifiers = identifierKeys.reduce( ( emptyObject, identifierKey ) => {
	if ( identifierKey === "isbn" ) {
		return emptyObject;
	}
	emptyObject[ identifierKey ] = "";
	return emptyObject;
}, {} );

let identifiersStore = wpseoWooIdentifiers || {};

/**
 * Fetches a list of all variations.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function getVariationsRequest( productId ) {
	const response = await apiFetch( {
		path: `/wp-json/wc/v3/products/${ productId }/variations`,
		method: "GET",
	} );
	return await response.json;
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
	if ( ! Object.hasOwnProperty( newData, "customData" ) ) {
		newData.customData = {};
	}
	newData.customData = Object.assign( newData.customData, {
		hasGlobalIdentifier: hasGlobalIdentifier(),
		hasVariants: hasVariants(),
		doAllVariantsHaveIdentifier: doAllVariantsHaveIdentifier(),
	} );

	return newData;
}

/**
 * A function that registers event listeners.
 *
 * @returns {void}.
 */
function registerEventListeners() {
	let variationIds = [];
	if ( identifiersStore.variations ) {
		variationIds = Object.keys( identifiersStore.variations );
	}

	// Detect price changes in the Variations metabox.
	jQuery( document.body ).on( "change", "#variable_product_options .woocommerce_variations :input[id^=variable_regular_price]", event => {
		// Get the id of the changed variation
		jQuery( event.target ).parents( ".woocommerce_variations .woocommerce_variation" ).find( "h3 strong" ).each( ( _, el ) => {
			const changedId = parseInt( el.innerText.substring( 1 ), 10 );
			const newValue = event.target.value;

			console.log( `variation id ${ changedId } changed to ${ event.target.value }` );
			if ( newValue === "" ) {
				const newVariations = omit( identifiersStore.variations, changedId );
				identifiersStore.variations = newVariations;
				return;
			}

			// If a price has been set, add a new empty variant unless it has stuff set already.
			const newVariantIdentifiers = emptyVariationIdentifiers;
			Object.keys( emptyVariationIdentifiers ).forEach( key => {
				const variationInput = document.getElementById( `yoast_variation_identifier[${ changedId }][${ key }]` );
				console.log( `Found ${ key } for ${ changedId } with value ${ variationInput.value }` );
				if ( variationInput ) {
					Object.assign( newVariantIdentifiers, {
						[ key ]: variationInput.value,
					} );
				}
			} );
			identifiersStore.variations[ changedId ] = newVariantIdentifiers;
			console.log( "new store variations: ", identifiersStore.variations );
		} );
	} );

	jQuery( "#woocommerce-product-data" ).on( "woocommerce_variations_loaded", ( { ...args } ) => {
		console.log( args );
		console.log( "hello!" );
		if ( identifiersStore.variations ) {
			variationIds = Object.keys( identifiersStore.variations );
		}
		console.log( "adding listeners for these variations: ", variationIds );
		identifierKeys.forEach( key => {
			variationIds.forEach( ( variationId ) => {
				const variationInput = document.getElementById( `yoast_variation_identifier[${ variationId }][${ key }]` );
				if ( variationInput ) {
					variationInput.addEventListener( "change", ( event ) => {
						const newValue = event.target.value;
						set( identifiersStore, `variations[${variationId}][${key}]`, newValue );
						console.log( "new identifiers store: ", identifiersStore );
						// IdentifiersStore = Object.assign( {}, identifiersStore, { variations: {
						// 	...identifiersStore.variations,
						// 	[ variationId ]: {
						// 		...identifiersStore.variations[ variationId ],
						// 		[ key ]: newValue,
						// 	},
						// } } );

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

// jQuery( "#woocommerce-product-data" ).on( "woocommerce_variations_loaded", ( { ...args } ) => {
// 	const fullList = getVariationsRequest( 362 );
// 	console.log( "fullList: ", fullList );
// } );

// /*
// Still to do: Add event to add variations if they receive a price or something, anything that could make them be output by product->get_available_variations...
// */
// jQuery( document.body ).on( "woocommerce_variations_added", ( { ...args } ) => {
// 	console.log( "variations added!: ", args );
// } );

// jQuery( "#variable_product_options" ).on( "woocommerce_variations_input_changed", ( inputThingy ) => {
// 	console.log( "INPUT CHANGED: ", inputThingy );
// } );

// jQuery( "#woocommerce-product-data" ).on( "woocommerce_variations_loaded", () => {
// 	// I'VE PUT SOME USEFUL BEGINNING DOM QUERIES HERE
// 	// WE COULD ALSO LOOK FOR THE NEEDS-UPDATE CLASS, WHICH GET'S ADDED IF SOMETHING UPDATES, BUT THIS WON'T CATCH ANY UPDATES DONE VIA THE BULK DROPDOWN.
// 	jQuery( ".woocommerce_variations .woocommerce_variation" ).find( "h3 strong" ).each( ( _, el ) => {
// 		console.log( el.innerText );
// 	} );
// 	jQuery( ".woocommerce_variations .woocommerce_variation" ).find( ':input[id^="variable_regular_price_"]' ).each( ( _, el ) => {
// 		console.log( el.value );
// 	} );
// } );

/*
Page load is just fine. Will have all variations that have prices (and are enabled????) and their identifiers.

Scenarios:
A person adds a variation
A person removes a variation
A person adds price to variation
A person removes price from a variation

A person edits variation identifiers.
*/
