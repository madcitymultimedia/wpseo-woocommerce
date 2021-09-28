import ProductDescriptionAssessment from "../../src/assessments/ProductDescriptionAssessment";
const mockL10n = {};

describe( "An assessment for scoring too long paragraphs.", function() {
	it( "scores 1 paragraph with ok length", function() {
		const productDescription = "The cat (Felis catus) is a domestic species of small carnivorous mammal. " +
			"It is the only domesticated species in " +
			"the family Felidae and is often referred to as the domestic cat to distinguish it from the wild members of the family." +
			" A cat can either be a house cat, a farm cat or a feral cat; the latter ranges freely and avoids human contact.";
		const paragraphTooLongAssessment = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult();
		expect( paragraphTooLongAssessment.getScore() ).toBe( 5 );
	} );
} );
