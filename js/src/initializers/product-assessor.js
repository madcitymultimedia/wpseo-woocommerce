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
	analysisWorker.setCustomSEOAssessorClass( productSEOAssessor.default, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/33e",
		introductionKeyphraseCTAUrl: "https://yoa.st/33f",
		keyphraseLengthUrlTitle: "https://yoa.st/33i",
		keyphraseLengthCTAUrl: "https://yoa.st/33j",
		keyphraseDensityUrlTitle: "https://yoa.st/33v",
		keyphraseDensityCTAUrl: "https://yoa.st/33w",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/33k",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/33l",
		metaDescriptionLengthUrlTitle: "https://yoa.st/34d",
		metaDescriptionLengthCTAUrl: "https://yoa.st/34e",
		subheadingsKeyphraseUrlTitle: "https://yoa.st/33m",
		subheadingsKeyphraseCTAUrl: "https://yoa.st/33n",
		textCompetingLinksUrlTitle: "https://yoa.st/34l",
		textCompetingLinksCTAUrl: "https://yoa.st/34m",
		textLengthUrlTitle: "https://yoa.st/34n",
		textLengthCTAUrl: "https://yoa.st/34o",
		titleKeyphraseUrlTitle: "https://yoa.st/33g",
		titleKeyphraseCTAUrl: "https://yoa.st/33h",
		titleWidthUrlTitle: "https://yoa.st/shopify52",
		titleWidthCTAUrl: "https://yoa.st/shopify53",
		urlKeyphraseUrlTitle: "https://yoa.st/shopify26",
		urlKeyphraseCTAUrl: "https://yoa.st/shopify27",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/shopify50",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/shopify51",
		singleH1UrlTitle: "https://yoa.st/shopify54",
		singleH1CTAUrl: "https://yoa.st/shopify55",
		imageCountUrlTitle: "https://yoa.st/shopify20",
		imageCountCTAUrl: "https://yoa.st/shopify21",
		imageKeyphraseUrlTitle: "https://yoa.st/shopify22",
		imageKeyphraseCTAUrl: "https://yoa.st/shopify23",
		imageAltTagsUrlTitle: "https://yoa.st/shopify40",
		imageAltTagsCTAUrl: "https://yoa.st/shopify41",
		keyphraseDistributionUrlTitle: "https://yoa.st/shopify30",
		keyphraseDistributionCTAUrl: "https://yoa.st/shopify31",
	} );
	analysisWorker.setCustomCornerstoneSEOAssessorClass( productCornerstoneSEOAssessor.default, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/shopify8",
		introductionKeyphraseCTAUrl: "https://yoa.st/shopify9",
		keyphraseLengthUrlTitle: "https://yoa.st/shopify10",
		keyphraseLengthCTAUrl: "https://yoa.st/shopify11",
		keyphraseDensityUrlTitle: "https://yoa.st/shopify12",
		keyphraseDensityCTAUrl: "https://yoa.st/shopify13",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/shopify14",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/shopify15",
		metaDescriptionLengthUrlTitle: "https://yoa.st/shopify46",
		metaDescriptionLengthCTAUrl: "https://yoa.st/shopify47",
		subheadingsKeyphraseUrlTitle: "https://yoa.st/shopify16",
		subheadingsKeyphraseCTAUrl: "https://yoa.st/shopify17",
		textCompetingLinksUrlTitle: "https://yoa.st/shopify18",
		textCompetingLinksCTAUrl: "https://yoa.st/shopify19",
		textLengthUrlTitle: "https://yoa.st/shopify58",
		textLengthCTAUrl: "https://yoa.st/shopify59",
		titleKeyphraseUrlTitle: "https://yoa.st/shopify24",
		titleKeyphraseCTAUrl: "https://yoa.st/shopify25",
		titleWidthUrlTitle: "https://yoa.st/shopify52",
		titleWidthCTAUrl: "https://yoa.st/shopify53",
		urlKeyphraseUrlTitle: "https://yoa.st/shopify26",
		urlKeyphraseCTAUrl: "https://yoa.st/shopify27",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/shopify50",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/shopify51",
		singleH1UrlTitle: "https://yoa.st/shopify54",
		singleH1CTAUrl: "https://yoa.st/shopify55",
		imageCountUrlTitle: "https://yoa.st/shopify20",
		imageCountCTAUrl: "https://yoa.st/shopify21",
		imageKeyphraseUrlTitle: "https://yoa.st/shopify22",
		imageKeyphraseCTAUrl: "https://yoa.st/shopify23",
		imageAltTagsUrlTitle: "https://yoa.st/shopify40",
		imageAltTagsCTAUrl: "https://yoa.st/shopify41",
		keyphraseDistributionUrlTitle: "https://yoa.st/shopify30",
		keyphraseDistributionCTAUrl: "https://yoa.st/shopify31",
	} );
	analysisWorker.setCustomContentAssessorClass( productContentAssessor.default, "productPage", {
		subheadingUrlTitle: "https://yoa.st/shopify68",
		subheadingCTAUrl: "https://yoa.st/shopify69",
		paragraphUrlTitle: "https://yoa.st/shopify66",
		paragraphCTAUrl: "https://yoa.st/shopify67",
		sentenceLengthUrlTitle: "https://yoa.st/shopify48",
		sentenceLengthCTAUrl: "https://yoa.st/shopify49",
		transitionWordsUrlTitle: "https://yoa.st/shopify44",
		transitionWordsCTAUrl: "https://yoa.st/shopify45",
		passiveVoiceUrlTitle: "https://yoa.st/shopify42",
		passiveVoiceCTAUrl: "https://yoa.st/shopify43",
		textPresenceUrlTitle: "https://yoa.st/shopify56",
		textPresenceCTAUrl: "https://yoa.st/shopify57",
		listsUrlTitle: "https://yoa.st/shopify38",
		listsCTAUrl: "https://yoa.st/shopify39",
	}  );
	analysisWorker.setCustomCornerstoneContentAssessorClass( productCornerstoneContentAssessor.default, "productPage", {
		subheadingUrlTitle: "https://yoa.st/shopify68",
		subheadingCTAUrl: "https://yoa.st/shopify69",
		paragraphUrlTitle: "https://yoa.st/shopify66",
		paragraphCTAUrl: "https://yoa.st/shopify67",
		sentenceLengthUrlTitle: "https://yoa.st/shopify48",
		sentenceLengthCTAUrl: "https://yoa.st/shopify49",
		transitionWordsUrlTitle: "https://yoa.st/shopify44",
		transitionWordsCTAUrl: "https://yoa.st/shopify45",
		passiveVoiceUrlTitle: "https://yoa.st/shopify42",
		passiveVoiceCTAUrl: "https://yoa.st/shopify43",
		textPresenceUrlTitle: "https://yoa.st/shopify56",
		textPresenceCTAUrl: "https://yoa.st/shopify57",
		listsUrlTitle: "https://yoa.st/shopify38",
		listsCTAUrl: "https://yoa.st/shopify39",
	}  );
	analysisWorker.setCustomRelatedKeywordAssessorClass( productRelatedKeywordAssessor.default, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/shopify8",
		introductionKeyphraseCTAUrl: "https://yoa.st/shopify9",
		keyphraseLengthUrlTitle: "https://yoa.st/shopify10",
		keyphraseLengthCTAUrl: "https://yoa.st/shopify11",
		keyphraseDensityUrlTitle: "https://yoa.st/shopify12",
		keyphraseDensityCTAUrl: "https://yoa.st/shopify13",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/shopify14",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/shopify15",
		textCompetingLinksUrlTitle: "https://yoa.st/shopify18",
		textCompetingLinksCTAUrl: "https://yoa.st/shopify19",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/shopify50",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/shopify51",
		imageKeyphraseUrlTitle: "https://yoa.st/shopify22",
		imageKeyphraseCTAUrl: "https://yoa.st/shopify23",
	}  );
	analysisWorker.setCustomCornerstoneRelatedKeywordAssessorClass( productCornerstoneRelatedKeywordAssessor.default, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/shopify8",
		introductionKeyphraseCTAUrl: "https://yoa.st/shopify9",
		keyphraseLengthUrlTitle: "https://yoa.st/shopify10",
		keyphraseLengthCTAUrl: "https://yoa.st/shopify11",
		keyphraseDensityUrlTitle: "https://yoa.st/shopify12",
		keyphraseDensityCTAUrl: "https://yoa.st/shopify13",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/shopify14",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/shopify15",
		textCompetingLinksUrlTitle: "https://yoa.st/shopify18",
		textCompetingLinksCTAUrl: "https://yoa.st/shopify19",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/shopify50",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/shopify51",
		imageKeyphraseUrlTitle: "https://yoa.st/shopify22",
		imageKeyphraseCTAUrl: "https://yoa.st/shopify23",
	}  );

	analysisWorker._configuration.customAnalysisType = "productPage";
}
