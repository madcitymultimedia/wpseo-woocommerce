import { Paper } from "yoastseo";
import getProductIdentifier from "../researches/getProductIdentifier";

export default function getPaperData() {
	const productIdentifierData = getProductIdentifier();
	return new Paper( {
		customData: {
			hasGlobalIdentifier: productIdentifierData.hasGlobalIdentifier,
			hasVariants: productIdentifierData.hasVariants,
			doAllVariantsHaveIdentifier: productIdentifierData.doAllVariantsHaveIdentifier,
		},
	} );
}
