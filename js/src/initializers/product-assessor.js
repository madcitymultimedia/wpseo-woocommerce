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
	analysisWorker._configuration.customAnalysisType = "productPage";
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
		titleWidthUrlTitle: "https://yoa.st/34h",
		titleWidthCTAUrl: "https://yoa.st/34i",
		urlKeyphraseUrlTitle: "https://yoa.st/33o",
		urlKeyphraseCTAUrl: "https://yoa.st/33p",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/functionwordskeyphrase-1",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/functionwordskeyphrase-2",
		singleH1UrlTitle: "https://yoa.st/3a6",
		singleH1CTAUrl: "https://yoa.st/3a7",
		imageCountUrlTitle: "https://yoa.st/4f4",
		imageCountCTAUrl: "https://yoa.st/4f5",
		imageKeyphraseUrlTitle: "https://yoa.st/4f7",
		imageKeyphraseCTAUrl: "https://yoa.st/4f6",
		imageAltTagsUrlTitle: "https://yoa.st/33c",
		imageAltTagsCTAUrl: "https://yoa.st/33d",
		keyphraseDistributionUrlTitle: "https://yoa.st/33q",
		keyphraseDistributionCTAUrl: "https://yoa.st/33u",
	} );
	analysisWorker.setCustomCornerstoneSEOAssessorClass( productCornerstoneSEOAssessor.default, "productPage", {
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
		titleWidthUrlTitle: "https://yoa.st/34h",
		titleWidthCTAUrl: "https://yoa.st/34i",
		urlKeyphraseUrlTitle: "https://yoa.st/33o",
		urlKeyphraseCTAUrl: "https://yoa.st/33p",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/functionwordskeyphrase-1",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/functionwordskeyphrase-2",
		singleH1UrlTitle: "https://yoa.st/3a6",
		singleH1CTAUrl: "https://yoa.st/3a7",
		imageCountUrlTitle: "https://yoa.st/4f4",
		imageCountCTAUrl: "https://yoa.st/4f5",
		imageKeyphraseUrlTitle: "https://yoa.st/4f7",
		imageKeyphraseCTAUrl: "https://yoa.st/4f6",
		imageAltTagsUrlTitle: "https://yoa.st/33c",
		imageAltTagsCTAUrl: "https://yoa.st/33d",
		keyphraseDistributionUrlTitle: "https://yoa.st/33q",
		keyphraseDistributionCTAUrl: "https://yoa.st/33u",
	} );
	analysisWorker.setCustomContentAssessorClass( productContentAssessor.default, "productPage", {
		subheadingUrlTitle: "https://yoa.st/34x",
		subheadingCTAUrl: "https://yoa.st/34y",
		paragraphUrlTitle: "https://yoa.st/35d",
		paragraphCTAUrl: "https://yoa.st/35e",
		sentenceLengthUrlTitle: "https://yoa.st/34v",
		sentenceLengthCTAUrl: "https://yoa.st/34w",
		transitionWordsUrlTitle: "https://yoa.st/34z",
		transitionWordsCTAUrl: "https://yoa.st/35a",
		passiveVoiceUrlTitle: "https://yoa.st/34t",
		passiveVoiceCTAUrl: "https://yoa.st/34u",
		textPresenceUrlTitle: "https://yoa.st/35h",
		textPresenceCTAUrl: "https://yoa.st/35i",
		listsUrlTitle: "https://yoa.st/4fe",
		listsCTAUrl: "https://yoa.st/4ff",
	}  );
	analysisWorker.setCustomCornerstoneContentAssessorClass( productCornerstoneContentAssessor.default, "productPage", {
		subheadingUrlTitle: "https://yoa.st/34x",
		subheadingCTAUrl: "https://yoa.st/34y",
		paragraphUrlTitle: "https://yoa.st/35d",
		paragraphCTAUrl: "https://yoa.st/35e",
		sentenceLengthUrlTitle: "https://yoa.st/34v",
		sentenceLengthCTAUrl: "https://yoa.st/34w",
		transitionWordsUrlTitle: "https://yoa.st/34z",
		transitionWordsCTAUrl: "https://yoa.st/35a",
		passiveVoiceUrlTitle: "https://yoa.st/34t",
		passiveVoiceCTAUrl: "https://yoa.st/34u",
		textPresenceUrlTitle: "https://yoa.st/35h",
		textPresenceCTAUrl: "https://yoa.st/35i",
		listsUrlTitle: "https://yoa.st/4fe",
		listsCTAUrl: "https://yoa.st/4ff",
	}  );
	analysisWorker.setCustomRelatedKeywordAssessorClass( productRelatedKeywordAssessor.default, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/33e",
		introductionKeyphraseCTAUrl: "https://yoa.st/33f",
		keyphraseLengthUrlTitle: "https://yoa.st/33i",
		keyphraseLengthCTAUrl: "https://yoa.st/33j",
		keyphraseDensityUrlTitle: "https://yoa.st/33v",
		keyphraseDensityCTAUrl: "https://yoa.st/33w",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/33k",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/33l",
		textCompetingLinksUrlTitle: "https://yoa.st/34l",
		textCompetingLinksCTAUrl: "https://yoa.st/34m",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/functionwordskeyphrase-1",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/functionwordskeyphrase-2",
		imageKeyphraseUrlTitle: "https://yoa.st/4f7",
		imageKeyphraseCTAUrl: "https://yoa.st/4f6",
	}  );
	analysisWorker.setCustomCornerstoneRelatedKeywordAssessorClass( productCornerstoneRelatedKeywordAssessor.default, "productPage", {
		introductionKeyphraseUrlTitle: "https://yoa.st/33e",
		introductionKeyphraseCTAUrl: "https://yoa.st/33f",
		keyphraseLengthUrlTitle: "https://yoa.st/33i",
		keyphraseLengthCTAUrl: "https://yoa.st/33j",
		keyphraseDensityUrlTitle: "https://yoa.st/33v",
		keyphraseDensityCTAUrl: "https://yoa.st/33w",
		metaDescriptionKeyphraseUrlTitle: "https://yoa.st/33k",
		metaDescriptionKeyphraseCTAUrl: "https://yoa.st/33l",
		textCompetingLinksUrlTitle: "https://yoa.st/34l",
		textCompetingLinksCTAUrl: "https://yoa.st/34m",
		functionWordsInKeyphraseUrlTitle: "https://yoa.st/functionwordskeyphrase-1",
		functionWordsInKeyphraseCTAUrl: "https://yoa.st/functionwordskeyphrase-2",
		imageKeyphraseUrlTitle: "https://yoa.st/4f7",
		imageKeyphraseCTAUrl: "https://yoa.st/4f6",
	}  );
}
