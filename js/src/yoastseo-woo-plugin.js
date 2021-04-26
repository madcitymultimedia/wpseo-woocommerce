/* global YoastSEO, wpseoWooL10n, tinyMCE */

import { getExcerpt, addExcerptEventHandlers, isTinyMCEAvailable } from "./yoastseo-woo-handle-excerpt-editors";
import { addFilter } from "@wordpress/hooks";
import { dispatch } from "@wordpress/data";

const PLUGIN_NAME = "YoastWooCommerce";

/**
 * Counters for the setTimeouts, used to make sure we don't end up in an infinite loop.
 *
 * @type {number}
 */
var buttonEventCounter = 0;
let productGalleryFallbackImage = "";


/**
 * Represents the Yoast Woocommerce plugin.
 */
class YoastWooCommercePlugin {
	/**
	 * Registers Plugin and Test for Yoast WooCommerce.
	 *
	 * @returns {void}
	 */
	constructor() {
		this.loadWorkerScript();

		YoastSEO.app.registerPlugin( "YoastWooCommercePlugin", { status: "ready" } );

		this.registerModifications();

		this.bindEvents();

		this.dispatchGooglePreviewData();

		addFilter( "yoast.socials.imageFallback", "yoast/yoast-woocommerce-seo/image_fallback", this.addProductGalleryImageAsFallback );
	}

	/**
	 * Loads our worker script into the analysis worker.
	 *
	 * @returns {void}
	 */
	loadWorkerScript() {
		if ( typeof YoastSEO === "undefined" || typeof YoastSEO.analysis === "undefined" || typeof YoastSEO.analysis.worker === "undefined" ) {
			return;
		}

		const worker = YoastSEO.analysis.worker;
		const productDescription = getExcerpt();

		worker.loadScript( wpseoWooL10n.script_url )
			.then( () => worker.sendMessage( "initialize", { l10n: wpseoWooL10n, productDescription }, PLUGIN_NAME ) )
			.then( YoastSEO.app.refresh );

		addExcerptEventHandlers( worker );
	}

	/**
	 * Binds events to the add_product_images anchor.
	 *
	 * @returns {void}
	 */
	bindEvents() {
		if ( isTinyMCEAvailable( "excerpt" ) ) {
			const excerptElement = tinyMCE.get( "excerpt" );
			excerptElement.on( "change", function() {
				YoastSEO.app.analyzeTimer();
			} );
		}

		jQuery( ".add_product_images" ).find( "a" ).on( "click", this.bindLinkEvent.bind( this ) );
		this.bindDeleteEvent();
	}

	/**
	 * Dispatches the product data from window.wpseoWooL10n to the Yoast SEO editor store.
	 *
	 * @returns {void}
	 */
	dispatchGooglePreviewData() {
		dispatch( "yoast-seo/editor" ).setShoppingData( window.wpseoWooL10n.wooGooglePreviewData );
	}

	/**
	 * After the modal dialog is opened, check for the button that adds images to the gallery to trigger
	 * the modification.
	 *
	 * @returns {void}
	 */
	bindLinkEvent() {
		if ( jQuery( ".media-modal-content" ).find( ".media-button" ).length === 0 ) {
			buttonEventCounter++;
			if ( buttonEventCounter < 10 ) {
				setTimeout( this.bindLinkEvent.bind( this ) );
			}
		} else {
			buttonEventCounter = 0;
			jQuery( ".media-modal-content" ).find( ".media-button" ).on( "click", this.buttonCallback.bind( this )  );
		}
	}

	/**
	 * After the gallery is added, call the analyzeTimer of the app, to add the modifications.
	 * Also call the bindDeleteEvent, to bind the analyzerTimer when an image is deleted.
	 *
	 * @returns {void}
	 */
	buttonCallback() {
		YoastSEO.app.analyzeTimer();
	}

	/**
	 * Checks if the delete buttons of the added images are available. When they are, bind the analyzeTimer function
	 * so when a image is removed, the modification is run.
	 *
	 * @returns {void}
	 */
	bindDeleteEvent() {
		jQuery( "#product_images_container" ).on( "click", ".delete", YoastSEO.app.analyzeTimer.bind( YoastSEO.app ) );
	}

	/**
	 * Registers the addContent modification.
	 *
	 * @returns {void}
	 */
	registerModifications() {
		var callback = this.addContent.bind( this );

		YoastSEO.app.registerModification( "content", callback, "YoastWooCommercePlugin", 10 );
	}

	/**
	 * Adds the short description and images from the page gallery to the content to be analyzed by the analyzer.
	 *
	 * @param {string} data The data string that does not have the images outer html.
	 *
	 * @returns {string} The data string parameter with the short description and the images outer html.
	 */
	addContent( data ) {
		data += "\n\n" + getExcerpt();

		var images = jQuery( "#product_images_container" ).find( "img" );
		for ( var i = 0; i < images.length; i++ ) {
			data += images[ i ].outerHTML;
		}

		productGalleryFallbackImage = images[ 0 ] ? images[ 0 ].src.replace( /-\d+x\d+(\.[a-zA-Z0-9]+)$/, "$1" ) : "";

		return data;
	}

	/**
	 * Adds the first product gallery image as fallback for social previews.
	 *
	 * @param {Object[]} fallbacks Array with fallback images in order.
	 *
	 * @returns {Object[]} fallbacks.
	 */
	addProductGalleryImageAsFallback( fallbacks ) {
		if ( productGalleryFallbackImage ) {
			fallbacks.push( { productGalleryImage: productGalleryFallbackImage } );
		}

		return fallbacks;
	}
}

/**
 * Adds eventlistener to load the Yoast WooCommerce plugin.
 */
if ( typeof YoastSEO !== "undefined" && typeof YoastSEO.app !== "undefined" ) {
	new YoastWooCommercePlugin(); // eslint-disable-line no-new
} else {
	jQuery( window ).on(
		"YoastSEO:ready",
		function() {
			new YoastWooCommercePlugin(); // eslint-disable-line no-new
		}
	);
}
