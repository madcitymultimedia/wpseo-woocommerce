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
		echo '<div id="yoast_seo_variation" class="panel woocommerce_options_panel">';
		echo '<div class="options_group">';
		echo '<h1>' . esc_html__( 'Yoast SEO options', 'yoast-woo-seo' ) . '</h1>';
		echo '<p>' . esc_html__( 'If this product variation has unique identifiers, you can enter them here', 'yoast-woo-seo' ) . '</p>';

		wp_nonce_field( 'yoast_woo_seo_variation_identifiers', '_wpnonce_yoast_seo_woo' );

		$variation_values = get_post_meta( $variation->ID, 'wpseo_variation_global_identifiers_values', true );

		foreach ( $this->global_identifier_types as $type => $label ) {
			$value = isset( $variation_values[ $type ] ) ? $variation_values[ $type ] : '';
			$this->input_field_for_identifier( $variation->ID, $type, $label, $value );
		}
		echo '</div>';
		echo '</div>';
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
	 *
	 * @return void
	 */
	protected function input_field_for_identifier( $variation_id, $type, $label, $value ) {
		echo '<p class="form-field">';
		echo '<label for="yoast_variation_identifier[', esc_attr( $variation_id ), '][', esc_attr( $type ), ']">', esc_html( $label ), ':</label>';
		echo '<span class="wrap">';
		echo '<input class="input-text" type="text" id="yoast_variation_identfier[', esc_attr( $variation_id ), '][', esc_attr( $type ), ']" name="yoast_seo_variation[',esc_attr( $variation_id ), '][', esc_attr( $type ), ']" value="', esc_attr( $value ), '"/>';
		echo '</span>';
		echo '</p>';
	}
}
