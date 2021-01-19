<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Generator_Interface;

/**
 * Class WPSEO_WooCommerce_Schema_Generator
 */
class WPSEO_WooCommerce_Schema_Generator implements Generator_Interface {

	/**
	 * The schema graph.
	 *
	 * @var array
	 */
	protected $graph;

	/**
	 * WPSEO_WooCommerce_Schema_Generator constructor.
	 *
	 * @param array $graph The schema graph.
	 */
	public function __construct( $graph ) {
		$this->graph = $graph;
	}

	/**
	 * Generates the schema.
	 *
	 * @param Meta_Tags_Context $context The meta tags context of the current page.
	 *
	 * @return array The generated schema.
	 */
	public function generate( Meta_Tags_Context $context ) {
		if ( ! is_array( $this->graph ) || empty( $this->graph ) ) {
			return [];
		}

		return [
			'@context' => 'https://schema.org',
			'@graph'   => $this->graph,
		];
	}
}
