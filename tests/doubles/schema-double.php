<?php

namespace Yoast\WP\Woocommerce\Tests\Doubles;

use WC_Product;
use WP_Term;
use WPSEO_WooCommerce_Schema;

/**
 * Test Helper Class.
 */
class Schema_Double extends WPSEO_WooCommerce_Schema {

	/**
	 * The schema data we're going to output.
	 *
	 * @var array
	 */
	public $data;

	/**
	 * WooCommerce SEO Options.
	 *
	 * @var array
	 */
	public $options;

	/**
	 * Tries to get the primary term, then the first term, null if none found.
	 *
	 * @param string $taxonomy_name Taxonomy name for the term.
	 * @param int    $post_id       Post ID for the term.
	 *
	 * @return WP_Term|null The primary term, the first term or null.
	 */
	public function get_primary_term_or_first_term( $taxonomy_name, $post_id ) {
		return parent::get_primary_term_or_first_term( $taxonomy_name, $post_id );
	}

	/**
	 * Filters the offers array to enrich it.
	 *
	 * @param array      $data    Schema Product data.
	 * @param WC_Product $product The product.
	 *
	 * @return array Schema Product data.
	 */
	public function filter_offers( $data, $product ) {
		return parent::filter_offers( $data, $product );
	}

	/**
	 * Update the seller attribute to reference the Organization, when it is set.
	 *
	 * @param array $data Schema Product data.
	 *
	 * @return array Schema Product data.
	 */
	public function change_seller_in_offers( $data ) {
		return parent::change_seller_in_offers( $data );
	}

	/**
	 * Enhances the review data output by WooCommerce.
	 *
	 * @param array      $data    Review Schema data.
	 * @param WC_Product $product The WooCommerce product we're working with.
	 *
	 * @return array Review Schema data.
	 */
	public function filter_reviews( $data, $product ) {
		return parent::filter_reviews( $data, $product );
	}

	/**
	 * Add a global identifier to our output if we have one.
	 *
	 * @param WC_Product $product Product object.
	 *
	 * @return bool
	 */
	public function add_global_identifier( $product ) {
		return parent::add_global_identifier( $product );
	}

	/**
	 * Enhances the SKU data output by WooCommerce.
	 *
	 * @param array      $data    SKU Schema data.
	 * @param WC_Product $product The WooCommerce product we're working with.
	 *
	 * @return array SKU Schema data.
	 */
	public function filter_sku( $data, $product ) {
		return parent::filter_sku( $data, $product );
	}
}
