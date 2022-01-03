import { Paper } from "yoastseo";
import EnglishResearcher from "yoastseo/src/languageProcessing/languages/en/Researcher.js";
import JapaneseResearcher from "yoastseo/src/languageProcessing/languages/ja/Researcher.js";
import DefaultResearcher from "yoastseo/src/languageProcessing/languages/_default/Researcher";
import ProductDescriptionAssessment from "../../src/assessments/ProductDescriptionAssessment";

const mockL10n = {};
const mockPaper = new Paper( "" );
const englishResearcher = new EnglishResearcher( mockPaper );
const japaneseResearcher = new JapaneseResearcher( mockPaper );
const defaultResearcher = new DefaultResearcher( mockPaper );

describe( "a test for product description length.", function() {
	it( "should return score 1 when the product description is empty", function() {
		const productDescription = "";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, englishResearcher );
		expect( result.getScore() ).toBe( 1 );
	} );
	it( "should still return score 1 when the product description is empty and the default Researcher is used", function() {
		const productDescription = "";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, defaultResearcher );
		expect( result.getScore() ).toBe( 1 );
	} );
	it( "should return score 5 when the product description contains less than 20 words", function() {
		const productDescription = "The cat (Felis catus) is a domestic species of small carnivorous mammal.";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, englishResearcher );
		expect( result.getScore() ).toBe( 5 );
	} );
	it( "should return score 5 when the product description contains more than 50 words", function() {
		const productDescription = "The cat (Felis catus) is a domestic species of small carnivorous mammal." +
			"It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it " +
			"from the wild members of the family. A cat can either be a house cat, a farm cat or a feral cat; the latter ranges freely " +
			"and avoids human contact. Domestic cats are valued by humans for companionship and their ability to hunt rodents. " +
			"About 60 cat breeds are recognized by various cat registries. The cat is similar in anatomy to the other felid species: " +
			"it has a strong flexible body, quick reflexes, sharp teeth and retractable claws adapted to killing small prey. Its night vision " +
			"and sense of smell are well developed. Cat communication includes vocalizations like meowing, " +
			"purring, trilling, hissing, growling and grunting as well as cat-specific body language.";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, englishResearcher );
		expect( result.getScore() ).toBe( 5 );
	} );
	it( "should return score 9 when the product description contains between 20 to 50 words", function() {
		const productDescription = "The cat (Felis catus) is a domestic species of small carnivorous mammal." +
			"It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it " +
			"from the wild members of the family.";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, englishResearcher );
		expect( result.getScore() ).toBe( 9 );
	} );
	it( "should still return score 9 when the product description contains between 20 to 50 words and the default Researcher is used", function() {
		const productDescription = "The cat (Felis catus) is a domestic species of small carnivorous mammal." +
			"It is the only domesticated species in the family Felidae and is often referred to as the domestic cat to distinguish it " +
			"from the wild members of the family.";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, defaultResearcher );
		expect( result.getScore() ).toBe( 9 );
	} );
} );

describe( "a test for product description length for Japanese.", function() {
	it( "should return score 1 when the product description is empty", function() {
		const productDescription = "";
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, japaneseResearcher );
		expect( result.getScore() ).toBe( 1 );
	} );
	it( "should return score 5 when the product description contains less than 40 characters", function() {
		const productDescription = "猫".repeat( 39 );
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, japaneseResearcher );
		expect( result.getScore() ).toBe( 5 );
	} );
	it( "should return score 5 when the product description contains more than 100 characters", function() {
		const productDescription = "猫".repeat( 102 );
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, japaneseResearcher );
		expect( result.getScore() ).toBe( 5 );
	} );
	it( "should return score 9 when the product description contains between 40 to 100 characters", function() {
		const productDescription = "猫".repeat( 50 );
		const result = new ProductDescriptionAssessment( productDescription, mockL10n ).getResult( mockPaper, japaneseResearcher );
		expect( result.getScore() ).toBe( 9 );
	} );
} );
