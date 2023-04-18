import { openWooCommerceTab, openVariation, scrollToElement } from "../../../src/initializers/input-focus/helpers";

import handleInputFocusForVariableProducts from "../../../src/initializers/input-focus/variable-product";

jest.mock( "../../../src/initializers/input-focus/helpers", () => ( {
	openWooCommerceTab: jest.fn(),
	scrollToElement: jest.fn(),
	openVariation: jest.fn(),
} ) );

/**
 * Mocks an SKU input field.
 *
 * @param {Number} index The product variant index.
 * @param {String} value The SKU value.
 *
 * @returns {HTMLInputElement} The SKU input field.
 */
function mockSKUField( index, value ) {
	const element = document.createElement( "input" );
	element.type = "text";
	element.name = `variable_sku[${index}]`;
	element.id = `variable_sku[${index}]`;
	element.value = value;

	jest.spyOn( element, "focus" );

	return element;
}

/**
 * Mocks the product identifiers element.
 *
 * @param {Number} postId The post id.
 * @param {Object} identifiers The product identifiers (missing ones are set to the empty string).
 *
 * @returns {HTMLDivElement} The element.
 */
function mockProductIdentifiers( postId, identifiers ) {
	const defaultIdentifiers = {
		gtin8: "",
		gtin12: "",
		gtin13: "",
		gtin14: "",
		isbn: "",
		mpn: "",
	};
	identifiers = Object.assign( defaultIdentifiers, identifiers );

	const element = document.createElement( "div" );
	element.innerHTML = `
	<h1>Yoast SEO options</h1>
	<p>If this product variation has unique identifiers, you can enter them here</p>`;

	Object.entries( identifiers ).forEach(
		( [ key, value ] ) => {
			const paragraph = document.createElement( "p" );

			const label = document.createElement( "label" );
			label.setAttribute( "for", `yoast_variation_identifier[${postId}][${key}]` );
			paragraph.appendChild( label );

			const input = document.createElement( "input" );
			input.setAttribute( "name", `yoast_variation_identifier[${postId}][${key}]` );
			input.setAttribute( "id", `yoast_variation_identifier[${postId}][${key}]` );
			input.value = value;
			paragraph.appendChild( input );

			element.appendChild( paragraph );
		}
	);

	return element;
}

/**
 * Mocks a WooCommerce product variation.
 *
 * @param {Number} index The variation index.
 * @param {Number} postId The post id.
 *
 * @returns {HTMLDivElement} The product variation element.
 */
function mockProductVariation( index, postId ) {
	const element = document.createElement( "div" );
	element.classList.add( "woocommerce_variation", "wc-metabox", "open" );

	element.innerHTML = `<input type="hidden" class="variable_post_id" name="variable_post_id[${index}]" value="${postId}">`;
	return element;
}

describe( "handle input focus for variable products", () => {
	beforeEach( () => {
		window.wpseoWooIdentifiers = {
			global_identifier_values: {
				gtin8: "",
				gtin12: "",
				gtin13: "",
				gtin14: "",
				isbn: "",
				mpn: "",
			},
			variations: {
				237: {
					gtin8: "",
					gtin12: "",
					gtin13: "",
					gtin14: "",
					isbn: "",
					mpn: "",
				},
				238: {
					gtin8: "",
					gtin12: "",
					gtin13: "",
					gtin14: "",
					isbn: "",
					mpn: "",
				},
			},
			available_variations: [],
		};

		window.wpseoWooSKU = {
			global_sku: "",
			variations: {
				237: "",
				238: "",
			},
			available_variations: [],
		};

		window.document.body.innerHTML = "";

		jest.useFakeTimers();
	} );

	afterEach( () => {
		delete window.wpseoWooSKU;
		delete window.wpseoWooIdentifiers;

		window.document.body.innerHTML = "";

		jest.useRealTimers();
	} );

	it( "handles the input focus for the SKU assessment", () => {
		const variantWithSKU = mockProductVariation( 0, 237 );
		const skuFieldFilledIn = mockSKUField( 0, "sku" );
		variantWithSKU.appendChild( skuFieldFilledIn );

		const variantWithoutSKU = mockProductVariation( 1, 238 );
		const skuFieldNotFilled = mockSKUField( 1, "" );
		variantWithoutSKU.appendChild( skuFieldNotFilled );

		window.document.body.appendChild( variantWithSKU );
		window.document.body.appendChild( variantWithoutSKU );

		handleInputFocusForVariableProducts( "productSKU" );

		// Fast-forward until all timers have been executed
		jest.runAllTimers();

		expect( openWooCommerceTab ).toBeCalledWith( ".variations_tab" );
		expect( openVariation ).toBeCalledWith( variantWithoutSKU, 1 );
		expect( skuFieldFilledIn.focus ).not.toBeCalled();
		expect( skuFieldNotFilled.focus ).toBeCalled();
		expect( scrollToElement ).toBeCalledWith( skuFieldNotFilled, { top: -200 } );
	} );

	it( "handles the input focus for the product identifier assessment", () => {
		const variantWithProductIdentifiers = mockProductVariation( 0, 237 );
		variantWithProductIdentifiers.appendChild(
			mockProductIdentifiers( 237, { gtin14: "1234-5678" } )
		);

		const variantWithoutProductIdentifiers = mockProductVariation( 1, 238 );
		variantWithoutProductIdentifiers.appendChild(
			mockProductIdentifiers( 238, {} )
		);

		window.document.body.appendChild( variantWithProductIdentifiers );
		window.document.body.appendChild( variantWithoutProductIdentifiers );

		handleInputFocusForVariableProducts( "productIdentifier" );

		// Fast-forward until all timers have been executed
		jest.runAllTimers();

		expect( openWooCommerceTab ).toBeCalledWith( ".variations_tab" );
		expect( openVariation ).toBeCalledWith( variantWithoutProductIdentifiers, 1 );
		expect( scrollToElement ).toBeCalledWith(
			variantWithoutProductIdentifiers.querySelector( "h1" ),
			{ top: -200 }
		);
	} );
} );
