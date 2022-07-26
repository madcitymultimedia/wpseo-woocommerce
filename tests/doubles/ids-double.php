<?php

namespace Yoast\WP\Woocommerce\Tests\Doubles;

use WPSEO_WooCommerce_Yoast_Ids;

/**
 * Class WPSEO_WooCommerce_Yoast_Tab_Double
 */
class Yoast_Ids_Double extends WPSEO_WooCommerce_Yoast_Ids {

	/**
	 * Get the variation global identifiers from the options
	 *
	 * @param int $post_id      Id of the variation parent post.
	 * @param int $variation_id Id of the variation.
	 *
	 * @return array The variation global identifiers.
	 */
	public function get_variation_values( $post_id, $variation_id ) {
		return parent::get_variation_values( $post_id, $variation_id );
	}

	/**
	 * Validate the variation global identifiers to the options
	 *
	 * @param int $variation_id Id of the variation.
	 *
	 * @return array Validated variation global identifiers.
	 */
	public function validate_variation_data( $variation_id ) {
		return parent::validate_variation_data( $variation_id );
	}

	/**
	 * Display an input field for an identifier.
	 *
	 * @param int    $variation_id Id of the variation.
	 * @param string $type         Type of identifier, used for input name.
	 * @param string $label        Label for the identifier input.
	 * @param string $value        Current value of the identifier.
	 * @param bool   $is_left      Wether the input text should float to the left of the container div.
	 *
	 * @return void
	 */
	public function input_field_for_identifier( $variation_id, $type, $label, $value, $is_left ) {
		parent::input_field_for_identifier( $variation_id, $type, $label, $value, $is_left );
	}
}
