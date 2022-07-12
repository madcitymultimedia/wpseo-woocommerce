/* global jQuery, tinyMCE, YoastSEO, wpseoWooIdentifiers */

const identifierKeys = [
	"gtin8",
	"gtin12",
	"gtin13",
	"gtin14",
	"isbn",
	"mpn",
];

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

	// Register listeners for variations when the variation loaded call is done
	console.log( jQuery( "#woocommerce-product-data" ) );
	console.log( "was daar iets?" );
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
		console.log( "ADDING!" );
		document.getElementById( `yoast_identfier_${ key }` ).addEventListener( "change", () => {
			console.log( `Global ${ key } changed!` );
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
