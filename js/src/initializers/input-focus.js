import { addAction } from "@wordpress/hooks";
import handleInputFocusForVariableProducts from "./input-focus/variable-product";
import handleInputFocusForSimpleProducts from "./input-focus/simple-product";
import { getProductData, getProductVariants } from "./woo-identifiers";
import { openWooCommerceMetabox } from "./input-focus/helpers";

/**
 * Focuses on the product field.
 *
 * @param {string} id The id of the assessment.
 * @returns {void}
 */
export function inputFocus( id ) {
	if ( id !== "productSKU" && id !== "productIdentifier" ) {
		return;
	}

	openWooCommerceMetabox();

	const productData = getProductData();

	if ( productData.productType === "variable" ) {
		const productVariants = getProductVariants();

		if ( productVariants.length > 0 ) {
			handleInputFocusForVariableProducts( id );
			return;
		}
	}

	handleInputFocusForSimpleProducts( id );
}

/**
 * Adds the code to focus on the input buttons on the product-specific assessments.
 *
 * @returns {void}
 */
export default function initializeInputFocus() {
	addAction( "yoast.focus.input", "yoast/wpseo-woocommerce/inputFocus", inputFocus );
}
