/* global jQuery, YoastSEO, wpseoWooIdentifiers */
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

// Create an object based on the identifier keys, to fill new variations with.
const emptyVariationIdentifiers = identifierKeys.reduce( ( emptyObject, identifierKey ) => {
	if ( identifierKey === "isbn" ) {
		return emptyObject;
	}
	emptyObject[ identifierKey ] = "";
	return emptyObject;
}, {} );

let identifiersStore = merge( {}, wpseoWooIdentifiers || {} );

// Store to keep track of the deletion process for a single variation.
let candidateForDeletion = "";

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

	// If an id was changed that we don't know about, add it to the variations store.
	if ( ! Object.keys( identifiersStore.variations ).includes( `${ changedId }` ) ) {
		identifiersStore.variations[ changedId ] = {};
	}

	if ( newValue === "" ) {
		const newAvailableVariations = identifiersStore.available_variations.filter( id => changedId !== id );
		/* eslint-disable-next-line camelcase */
		identifiersStore.available_variations = newAvailableVariations;
		console.log( "new store before refresh: ", identifiersStore );
		YoastSEO.app.refresh();
		return;
	}

	// If it's a new id that receives a price, add it to available variations.
	if ( ! identifiersStore.available_variations.includes( changedId ) ) {
		identifiersStore.available_variations.push( changedId );
	}

	// Refresh the app so the analysis runs.
	console.log( "new store before refresh: ", identifiersStore );
	YoastSEO.app.refresh();
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

	setWith( identifiersStore.variations, `[${ variantId }][${ identifierKey }]`, event.target.value, Object );
	console.log( "new identifiersstore variations: ", identifiersStore.variations );

	// Refresh the app so the analysis runs.
	console.log( "new store before refresh: ", identifiersStore );
	YoastSEO.app.refresh();
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
	jQuery( "#variable_product_options" ).on( "click", ".remove_variation", ( event ) => {
		if ( event.target && event.target.rel ) {
			candidateForDeletion = event.target.rel;
		}
	} );

	jQuery( "#woocommerce-product-data" ).on( "woocommerce_variations_removed", () => {
		if ( candidateForDeletion === "" ) {
			return;
		}

		// Remove the variation that was the candidate to release.
		const newAvailableVariations = identifiersStore.available_variations.filter( id => parseInt( candidateForDeletion, 10 ) !== id );
		/* eslint-disable-next-line camelcase */
		identifiersStore.available_variations = newAvailableVariations;
		candidateForDeletion = "";

		console.log( "new store before refresh: ", identifiersStore );
		YoastSEO.app.refresh();
	} );

	jQuery( document.body ).on( "change", "#variable_product_options .woocommerce_variations :input[id^=variable_regular_price]", handlePriceChange );

	// Detect changes in the variation identifiers and handle them.
	jQuery( document.body ).on(
		"change", "#variable_product_options .woocommerce_variations :input[id^=yoast_variation_identifier]",
		handleVariationIdentifierChange
	);

	// Register event listeners for the global identifier inputs (non-variation);
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
			console.log( "new store before refresh: ", identifiersStore );
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

/*
Page load is just fine. Will have all variations that have prices (and are enabled????) and their identifiers.

Scenarios:
A person adds a variation COVERED
A person removes a variation DONE but bug with modal
A person adds price to variation DONE
A person removes price from a variation DONE
A person edits variation identifiers. DONE

A person adds prices with bulk -> plan made -> move all ids to available_ids if the price is not null :scream:
A person deletes all variations
A person creates variations from all attributes


if all else fails, we just monitor the bulk events and put the score on gray until they reload the page. This is lingo realm.
*/
