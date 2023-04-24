import handleInputFocusForSimpleProducts from "../../../src/initializers/input-focus/simple-product";
import { openWooCommerceTab, scrollToElement } from "../../../src/initializers/input-focus/helpers";

jest.mock( "../../../src/initializers/input-focus/helpers", () => ( {
	openWooCommerceTab: jest.fn(),
	scrollToElement: jest.fn(),
	openVariation: jest.fn(),
} ) );

/**
 * Mocks the SKU input element.
 *
 * @param {string} sku The SKU.
 * @returns {HTMLInputElement} The mocked SKU input element.
 */
function mockSKUField( sku ) {
	const element = document.createElement( "input" );
	element.id = "_sku";
	element.type = "text";
	element.value = sku.toString();

	jest.spyOn( element, "focus" );

	return element;
}

describe( "input focus for simple products", () => {
	it( "handles the input focus for the SKU assessment", () => {
		const mockedSKUField = mockSKUField( "1234-5678" );
		document.body.appendChild( mockedSKUField );

		handleInputFocusForSimpleProducts( "productSKU" );

		expect( openWooCommerceTab ).toBeCalledWith( ".inventory_tab" );
		expect( mockedSKUField.focus ).toBeCalled();
		expect( scrollToElement ).toBeCalledWith( mockedSKUField, { top: -300 } );
	} );
	it( "handles the input focus for the product identifiers assessment", () => {
		const productIdentifierTab = document.createElement( "div" );
		productIdentifierTab.id = "yoast_seo";
		jest.spyOn( productIdentifierTab, "focus" );
		document.body.appendChild( productIdentifierTab );

		handleInputFocusForSimpleProducts( "productIdentifier" );

		expect( openWooCommerceTab ).toBeCalledWith( ".yoast_tab_tab" );
		expect( scrollToElement ).toBeCalledWith( productIdentifierTab, { top: -200 } );
	} );
} );
