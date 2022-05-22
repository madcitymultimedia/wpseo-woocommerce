<?php

namespace Yoast\WP\Woocommerce\Tests\Doubles;

use WPSEO_WooCommerce_Yoast_Ids;

/**
 * Class WPSEO_WooCommerce_Yoast_Tab_Double
 */
class Yoast_Ids_Double extends WPSEO_WooCommerce_Yoast_Ids {

	/**
	 * Gets the variation global identifiers from the options
	 */
	public function get_variation_values( $post_id, $variation_id ) {
		return parent::get_variation_values( $post_id, $variation_id );
	}


	public function save_variation_data( $variation_id ) {
		return parent::save_variation_data( $variation_id );
	}

	/**
	 * Displays an input field for an identifier.
	 *
	 * @param string $type  Type of identifier, used for input name.
	 * @param string $label Label for the identifier input.
	 * @param string $value Current value of the identifier.
	 *
	 * @return void
	 */
	public function input_field_for_identifier( $variation_id, $type, $label, $value, $is_left ) {
		parent::input_field_for_identifier( $variation_id, $type, $label, $value, $is_left );
	}
}
