/* global analysisWorker */

import ProductDescriptionAssessment from "./assessments/ProductDescriptionAssessment";
import initializeProductAssessors from "./initializers/product-assessor";

const PLUGIN_NAME = "YoastWooCommerce";
const ASSESSMENT_NAME = "productTitle";

/**
 * Represents the WooCommerce worker.
 */
class WooCommerceWorker {
	/**
	 * Constructs a worker to be run inside the analysis web worker.
	 */
	constructor() {
		this._worker = analysisWorker;
	}

	/**
	 * Registers our custom messages.
	 *
	 * @returns {void}
	 */
	register() {
		this._worker.registerMessageHandler( "initialize", this.initialize.bind( this ), PLUGIN_NAME );
		this._worker.registerMessageHandler( "updateProductDescription", this.updateProductDescription.bind( this ), PLUGIN_NAME );
	}

	/**
	 * Initializes our custom assessment.
	 *
	 * @param {string} productDescription The current product description.
	 * @param {Object} l10n Translation object with our translations.
	 *
	 * @returns {void}
	 */
	initialize( { productDescription, l10n } ) {
		this._productDescriptionAssessment = new ProductDescriptionAssessment( productDescription, l10n );

		this._worker.registerAssessment( ASSESSMENT_NAME, this._productDescriptionAssessment, PLUGIN_NAME );
		this._worker.refreshAssessment( ASSESSMENT_NAME, PLUGIN_NAME );
	}

	/**
	 * Updates the product description in the assessment and marks it as refreshed.
	 *
	 * @param {string} productDescription The new product description.
	 *
	 * @returns {void}
	 */
	updateProductDescription( productDescription ) {
		this._productDescriptionAssessment.updateProductDescription( productDescription );

		this._worker.refreshAssessment( ASSESSMENT_NAME, PLUGIN_NAME );
	}
}

const wooCommerceWorker = new WooCommerceWorker();

wooCommerceWorker.register();
initializeProductAssessors();
