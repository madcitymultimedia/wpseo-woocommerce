/* global jQuery, YoastSEO */
import initialize from "./initializers/woo-identifiers";

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
		initialize();
		return;
	}

	// Otherwise, add an event that will be executed when YoastSEO will be available.
	jQuery( window ).on(
		"YoastSEO:ready",
		function() {
			initialize();
		}
	);
}

initializeGlobalIdentifierScripts();
