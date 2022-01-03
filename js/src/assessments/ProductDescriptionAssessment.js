import { merge } from "lodash-es";
import { languageProcessing, Assessment, AssessmentResult } from "yoastseo";

/**
 * Represents the assessment for the product description.
 */
export default class ProductDescriptionAssessment extends Assessment {
	/**
	 * Constructs a product description assessment.
	 *
	 * @param {string} productDescription   The product description as it is when initializing.
	 * @param {Object} l10n                 The translations for this assessment.
	 *
	 * @returns {void}
	 */
	constructor( productDescription, l10n ) {
		super();

		this._l10n = l10n;
		this.updateProductDescription( productDescription );

		this._config = {
			parameters: {
				recommendedMinimum: 20,
				recommendedMaximum: 50,
			},
			scores: {
				veryBad: 1,
				bad: 5,
				good: 9,
			},
		};

		this.identifier = "productDescription";
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
	 * Checks if there is language-specific config, and if so, overwrites the current config with it.
	 *
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 *
	 * @returns {Object} The config to use.
	 */
	getConfig( researcher ) {
		let config = this._config;
		if ( researcher.getConfig( "language" ) === "ja" ) {
			const japaneseConfig = {
				parameters: {
					recommendedMinimum: 40,
					recommendedMaximum: 100,
				} };
			config = merge( config, japaneseConfig );
		}
		return config;
	}

	/**
	 * Tests the length of the product description.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling research.
	 *
	 * @returns {AssessmentResult} an assessment result with the score and formatted text.
	 */
	getResult( paper, researcher ) {
		const productDescription = this._productDescription;

		const strippedProductDescription = languageProcessing.stripHTMLTags( productDescription );
		const customCountLength = researcher.getHelper( "customCountLength" );
		const productDescriptionLength = customCountLength
			? customCountLength( strippedProductDescription )
			: languageProcessing.getWords( strippedProductDescription ).length;

		const config = this.getConfig( researcher );
		const result = this.scoreProductDescription( productDescriptionLength, config );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( result.score );
		assessmentResult.setText( result.text );

		return assessmentResult;
	}

	/**
	 * Returns the score based on the length of the product description.
	 *
	 * @param {number} length   The length of the product description.
	 * @param {Object} config   The configuration to use.
	 *
	 * @returns {{score: number, text: *}} The result object with score and text.
	 */
	scoreProductDescription( length, config ) {
		if ( length === 0 ) {
			return {
				score: config.scores.veryBad,
				text: this._l10n.woo_desc_none,
			};
		}

		if ( length > 0 && length < config.parameters.recommendedMinimum ) {
			return {
				score: config.scores.bad,
				text: this._l10n.woo_desc_short,
			};
		}

		if ( length >= config.parameters.recommendedMinimum &&
			length <= config.parameters.recommendedMaximum ) {
			return {
				score: config.scores.good,
				text: this._l10n.woo_desc_good,
			};
		}

		if ( length > config.parameters.recommendedMaximum ) {
			return {
				score: config.scores.bad,
				text: this._l10n.woo_desc_long,
			};
		}
	}
}
