<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

/**
 * Class WPSEO_WooCommerce_Slack
 */
class WPSEO_WooCommerce_Slack {

	/**
	 * Register hooks.
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_enhanced_data', [ $this, 'filter_enhanced_data' ], 10, 2 );
	}

	/**
	 * Replace the default enhanced data (author, reading time) with custom data.
	 *
	 * @param array $data The array of labels => value.
	 * @param Indexable_Presentation $presentation  The indexable presentation.
	 *
	 * @return array The filtered array.
	 */
	public function filter_enhanced_data( $data, $presentation ) {
		$object     = $presentation->model;
		$product    = \wc_get_product( $object->object_id );

		if ( $product ) {
			$data       = [];
			$product_type = WPSEO_WooCommerce_Utils::get_product_type( $product );
			// Omit the price amount for variable and grouped products.
			$show_price = apply_filters( 'Yoast\WP\Woocommerce\og_price', true ) && ! ( $product_type === 'variable' || $product_type === 'grouped' );

			$availability = 'Out of stock';
			if ( $product->is_on_backorder() ) {
				$availability = 'On backorder';
			}

			if ( $product->is_in_stock() ) {
				$availability = 'In stock';
			}

			if ( $show_price ) {
				$price = \wp_strip_all_tags( $product->get_price_html() );
				$data[ __( 'Price', 'woocommerce' ) ] = $price;
			}
			$data[ __( 'Availability', 'woocommerce' ) ] = __( $availability, 'woocommerce' );
		}

		return $data;
	}
}
