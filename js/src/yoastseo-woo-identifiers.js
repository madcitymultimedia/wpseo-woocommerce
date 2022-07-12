/* global jQuery, wp, YoastSEO, wpseoWooIdentifiers */

const identifierKeys = [
	"gtin8",
	"gtin12",
	"gtin13",
	"gtin14",
	"isbn",
	"mpn",
];

/**
 * Returns whether the product (or product variant) has at least one product identifier filled in.
 *
 * @param {[string]}  identifierIDs		The IDs of the identifiers to check.
 *
 * @returns {boolean} Whether the product/variant has at least one identifier.
 */
const hasAtLeastOneIdentifier = function( identifierIDs ) {
	for ( let i = 0; i < identifierIDs.length; i++ ) {
		const identifierID = identifierIDs[ i ];
		const identifierValue = document.querySelector( "#" + identifierID ).value;
		// eslint-disable-next-line no-undefined
		if ( identifierValue !== undefined && identifierValue !== "" ) {
			return true;
		}
	}
	return false;
};


const identifiersStore = wpseoWooIdentifiers || {};

/**
 * Checks whether the product has a global identifier
 *
 * @returns {boolean} Whether the product has a global identifier.
 */
function hasGlobalIdentifier() {
	console.log( "doing calculations on this thing: ", identifiersStore );
	console.log( "has global identifier: ", Object.values( identifiersStore.global_identifier_values ).some( identifier => identifier !== "" ) );
	return Object.keys( identifiersStore.global_identifier_values ).some( identifier => identifier !== "" );
}

/**
 * @returns {void}
 */
function sendAssessmentData() {
	if ( wp && wp.hooks ) {
		wp.hooks.addFilter( "yoast.analysis.data", "wpseo-woocommerce-identifier-data", data => {
			data.customData = {};
			Object.assign( data.customData, {
				hasGlobalIdentifier: hasGlobalIdentifier(),
				hasVariants: false,
			} );
			console.log( "data: ", data );
			return data;
		} );
	}
	console.log( "common sense check: ", hasGlobalIdentifier() );
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
	console.log( variationIds );

	// $( document ).on( "woocommerce_loaded", () => {
	// 	console.log( document.getElementById( "woocommerce-product-data" ) );
	// 	console.log( "nothing??" );
	// } );

	jQuery( "#woocommerce-product-data" ).on( "woocommerce_variations_loaded", () => {
		console.log( "NOW!" );
		identifierKeys.forEach( key => {
			console.log( key );
			variationIds.forEach( ( variationId ) => {
				console.log( variationId );
				const variationInput = document.getElementById( `yoast_variation_identifier[${ variationId }][${ key }]` );
				if ( variationInput ) {
					variationInput.addEventListener( "change", () => {
						console.log( `Variation ${ variationId } ${ key } changed!` );


						/*
						todo:
						recalculate custom data for the paper,
						add the new custom data to the filter,
						trigger refresh (luxury: only if changed)
						*/

					} );
				}
			} );
		} );
	} );

	identifierKeys.forEach( key => {
		const globalIdentifierInput = document.getElementById( `yoast_identfier_${ key }` );
		globalIdentifierInput.addEventListener( "change", ( event ) => {
			console.log( `Global ${ key } changed!` );

			const newValue = event.target.value;
			identifiersStore.global_identifier_values[ key ] = newValue;
			console.log( "just updated the store: ", identifiersStore );

			sendAssessmentData();
			YoastSEO.app.refresh();
			console.log( "refresh over" );

			/*
			todo:
			recalculate custom data for the paper,
			add the new custom data to the filter,
			trigger refresh (luxury: only if changed)
			*/
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
	console.log( "test" );
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
