import ProductDescriptionAssessment from "../../src/assessments/ProductDescriptionAssessment";
const mockL10n = {};

describe( "a test for product description length.", function() {
	it( "returns score 1 when the product description is empty", function() {
		const productDescription = "";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult();
		expect( result.getScore() ).toBe( 1 );
	} );
	it( "returns score 5 when the product description contains less than 20 words", function() {
		const productDescription = "The cat (Felis catus) is a domestic species of small carnivorous mammal.";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult();
		expect( result.getScore() ).toBe( 5 );
	} );
	it( "returns score 5 when the product description contains more than 50 words", function() {
		const productDescription = "The cat (Felis catus) is a domestic species of small carnivorous mammal." +
			"It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it " +
			"from the wild members of the family. A cat can either be a house cat, a farm cat or a feral cat; the latter ranges freely " +
			"and avoids human contact. Domestic cats are valued by humans for companionship and their ability to hunt rodents. " +
			"About 60 cat breeds are recognized by various cat registries. The cat is similar in anatomy to the other felid species: " +
			"it has a strong flexible body, quick reflexes, sharp teeth and retractable claws adapted to killing small prey. Its night vision " +
			"and sense of smell are well developed. Cat communication includes vocalizations like meowing, " +
			"purring, trilling, hissing, growling and grunting as well as cat-specific body language.";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult();
		expect( result.getScore() ).toBe( 5 );
	} );
	it( "returns score 9 when the product description contains between 20 to 50 words", function() {
		const productDescription = "The cat (Felis catus) is a domestic species of small carnivorous mammal." +
			"It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it " +
			"from the wild members of the family.";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult();
		expect( result.getScore() ).toBe( 9 );
	} );
} );
