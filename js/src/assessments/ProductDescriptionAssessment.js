import { languageProcessing, Assessment, AssessmentResult } from "yoastseo";

/**
 * Represents the assessment for the product description.
 */
export default class ProductDescriptionAssessment extends Assessment {
	/**
	 * Constructs a product description assessment.
	 *
	 * @param {string} productDescription The product description as it is when initializing
	 * @param {Object} l10n The translations for this assessment.
	 *
	 * @returns {void}
	 */
	constructor( productDescription, l10n ) {
		super();

		this._l10n = l10n;
		this.updateProductDescription( productDescription );
	}

	/**
	 * Updates the product description to the given one.
	 *
	 * @param {string} productDescription The current product description.
	 *
	 * @returns {void}
	 */
	updateProductDescription( productDescription ) {
		this._productDescription = productDescription;
	}

	/**
	 * Tests the length of the product description.
	 *
	 * @returns {object} an assessment result with the score and formatted text.
	 */
	getResult() {
		const productDescription = this._productDescription;

		const strippedProductDescription = languageProcessing.stripHTMLTags( productDescription );
		const productDescriptionLength = languageProcessing.getWords( strippedProductDescription ).length;

		const result = this.scoreProductDescription( productDescriptionLength );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( result.score );
		assessmentResult.setText( result.text );

		return assessmentResult;
	}

	/**
	 * Returns the score based on the length of the product description.
	 *
	 * @param {number} length The length of the product description.
	 * @returns {{score: number, text: *}} The result object with score and text.
	 */
	scoreProductDescription( length ) {
		if ( length === 0 ) {
			return {
				score: 1,
				text: this._l10n.woo_desc_none,
			};
		}

		if ( length > 0 && length < 20 ) {
			return {
				score: 5,
				text: this._l10n.woo_desc_short,
			};
		}

		if ( length >= 20 && length <= 50 ) {
			return {
				score: 9,
				text: this._l10n.woo_desc_good,
			};
		}

		if ( length > 50 ) {
			return {
				score: 5,
				text: this._l10n.woo_desc_long,
			};
		}
	}
}
