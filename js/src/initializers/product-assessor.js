/* global analysisWorker */
// Product page assessors.
const productSEOAssessor = require( "yoastseo/src/scoring/productPages/seoAssessor" );
const productCornerstoneSEOAssessor = require( "yoastseo/src/scoring/productPages/cornerstone/seoAssessor" );
const productContentAssessor = require( "yoastseo/src/scoring/productPages/contentAssessor" );
const productCornerstoneContentAssessor = require( "yoastseo/src/scoring/productPages/cornerstone/contentAssessor" );
const productRelatedKeywordAssessor = require( "yoastseo/src/scoring/productPages/relatedKeywordAssessor" );
const productCornerstoneRelatedKeywordAssessor = require( "yoastseo/src/scoring/productPages/cornerstone/relatedKeywordAssessor" );

/**
 * Initialize the product assessors.
 *
 * @returns {void}
 */
export default function initialize() {
	// Store product pages.
	analysisWorker.setCustomSEOAssessorClass( productSEOAssessor.default, "productPage", { helpArticle: "https://yoa.st/1231" } );
	analysisWorker.setCustomCornerstoneSEOAssessorClass( productCornerstoneSEOAssessor.default, "productPage" );
	analysisWorker.setCustomContentAssessorClass( productContentAssessor.default, "productPage"  );
	analysisWorker.setCustomCornerstoneContentAssessorClass( productCornerstoneContentAssessor.default, "productPage"  );
	analysisWorker.setCustomRelatedKeywordAssessorClass( productRelatedKeywordAssessor.default, "productPage"  );
	analysisWorker.setCustomCornerstoneRelatedKeywordAssessorClass( productCornerstoneRelatedKeywordAssessor.default, "productPage"  );

	analysisWorker._configuration.customAnalysisType = "productPage";
}
