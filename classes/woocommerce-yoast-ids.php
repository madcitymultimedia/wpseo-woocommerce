<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

/**
 * Class WPSEO_WooCommerce_Yoast_Ids
 */
class WPSEO_WooCommerce_Yoast_Ids {

	/**
	 * The array of allowed identifier types.
	 *
	 * @var string[]
	 */
	protected $global_identifier_types = [
		'gtin8'  => 'GTIN8',
		'gtin12' => 'GTIN12 / UPC',
		'gtin13' => 'GTIN13 / EAN',
		'gtin14' => 'GTIN14 / ITF-14',
		'isbn'   => 'ISBN',
		'mpn'    => 'MPN',
	];

	/**
	 * WPSEO_WooCommerce_Yoast_Ids constructor.
	 */
	public function __construct() {
		add_action( 'woocommerce_product_after_variable_attributes', [ $this, 'add_variations_global_ids' ], 10, 3 );
		add_action( 'woocommerce_save_product_variation', [ $this, 'save_data' ], 10, 1 );
	}

	/**
	 * Add global identifiers text fields to a variation description.
	 *
	 * @param int     $loop The iteration number.
	 * @param array   $variation_data Data related to the variation.
	 * @param WP_Post $variation The variation object.
	 *
	 * @return void
	 */
	public function add_variations_global_ids( $loop, $variation_data, $variation ) {
		echo '<h1>' . esc_html__( 'Yoast SEO options', 'yoast-woo-seo' ) . '</h1>';
		echo '<p>' . esc_html__( 'If this product variation has unique identifiers, you can enter them here', 'yoast-woo-seo' ) . '</p>';
		
		$variation_values = $this->get_variation_values( $variation );
		
		echo '<div>';
		$is_left = true;
		foreach ( $this->global_identifier_types as $type => $label ) {
			$value = isset( $variation_values[ $type ] ) ? $variation_values[ $type ] : '';
			$this->input_field_for_identifier( $variation->ID, $type, $label, $value, $is_left );
			$is_left = ! $is_left; 
		}
		wp_nonce_field( 'yoast_woo_seo_variation_identifiers', '_wpnonce_yoast_seo_woo' );
		echo '</div>';
	}

	/**
	 * Gets values of each global identifier specified for a variation.
	 *
	 * @param WP_Post $variation The variation.
	 *
	 * @return array The variation global identifiers.
	 */
	protected function get_variation_values( $variation ) {
		$global_identifiers_product_values   = get_post_meta( $variation->post_parent, 'wpseo_global_identifier_values', true );
		$global_identifiers_variation_values = get_post_meta( $variation->ID, 'wpseo_variation_global_identifiers_values', true );

		foreach ( $global_identifiers_variation_values as $global_identifier_name => $global_identifier_value ) {
			// If the variation global identifier is not set and the product global identifier is set, we revert use that for the variation too.
			if ( empty( $global_identifier_value ) && ! ( empty( $global_identifiers_product_values[ $global_identifier_name ] ) ) ) {
				$global_identifiers_variation_values[ $global_identifier_name ] = $global_identifiers_product_values[ $global_identifier_name ];
			}
		}

		return $global_identifiers_variation_values;
	}

	/**
	 * Grab the values from the $_POST data and validate them.
	 *
	 * @param int $variation_id The id of the variation to be saved.
	 *
	 * @return array Valid save data.
	 */
	protected function save_variation_data( $variation_id ) {
		$values = [];
		foreach ( $this->global_identifier_types as $key => $label ) {
			// Ignoring nonce verification as we do that elsewhere, sanitization as we do that below.
			// phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			$value = isset( $_POST['yoast_seo_variation'][ $variation_id ][ $key ] ) ? wp_unslash( $_POST['yoast_seo_variation'][ $variation_id ][ $key ] ) : '';
			if ( $this->validate_data( $value ) ) {
				$values[ $key ] = $value;
			}
		}

		return $values;
	}

	/**
	 * Save the $_POST values from the variation's ids div.
	 *
	 * @param int $variation_id The variation ID.
	 *
	 * @return bool Whether or not we saved data.
	 */
	public function save_data( $variation_id ) {
		$nonce = filter_input( INPUT_POST, '_wpnonce_yoast_seo_woo' );
		if ( ! wp_verify_nonce( $nonce, 'yoast_woo_seo_variation_identifiers' ) ) {
			return false;
		}

		$values = $this->save_variation_data( $variation_id );

		if ( $values !== [] ) {
			return update_post_meta( $variation_id, 'wpseo_variation_global_identifiers_values', $values );
		}

		return false;
	}

	/**
	 * Make sure the data is safe to save.
	 *
	 * @param string $value The value we're testing.
	 *
	 * @return bool True when safe and not empty, false when it's not.
	 */
	protected function validate_data( $value ) {
		if ( wp_strip_all_tags( $value ) !== $value ) {
			return false;
		}

		return true;
	}

	/**
	 * Displays an input field for an identifier.
	 *
	 * @param string $variation_id  The id of the variation.
	 * @param string $type          Type of identifier, used for input name.
	 * @param string $label         Label for the identifier input.
	 * @param string $value         Current value of the identifier.
	 * @param bool   $is_left        Wether the field is on the left or not.

	 *
	 * @return void
	 */
	protected function input_field_for_identifier( $variation_id, $type, $label, $value, $is_left ) {
		/*
		woocommerce_wp_text_input(
			array(
				'id'                => 'yoast_variation_identfier[' . esc_attr( $variation_id ) . '][' . esc_attr( $type ) . ']',
				'name'              => 'yoast_seo_variation[' . esc_attr( $variation_id ) . '][' . esc_attr( $type ) . ']',
				'value'             => esc_attr( $value ),
				'label'             => $label,
				'wrapper_class'     => $wrapper,
				)
			);*/
			
		$style = $is_left ? 'style="display: inline-block; width: 48%; float: left;"' : 'style="display: inline-block; width: 48%; float: right;"';
		//$margin = $is_odd ? 
		echo '<p ', $style, '">';
		echo '<label for="yoast_variation_identifier[', esc_attr( $variation_id ), '][', esc_attr( $type ), ']" style="display: block;">', esc_html( $label ), '</label>';
		echo '<input class="short" type="text" style="line-height: 2.75; width: 100%;" id="yoast_variation_identfier[', esc_attr( $variation_id ), '][', esc_attr( $type ), ']" name="yoast_seo_variation[',esc_attr( $variation_id ), '][', esc_attr( $type ), ']" value="', esc_attr( $value ), '"/>';
		echo '</p>';
}

}
