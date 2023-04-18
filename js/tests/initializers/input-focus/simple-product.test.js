import handleInputFocusForSimpleProducts from "../../../src/initializers/input-focus/simple-product";

describe.skip( "input focus for simple products", () => {
	it( "handles the input focus for the SKU assessment", () => {
		handleInputFocusForSimpleProducts("productSKU" );
	} );
	it( "handles the input focus for the product identifiers assessment", () => {
		handleInputFocusForSimpleProducts( "productIdentifiers" );
	} );
} );
