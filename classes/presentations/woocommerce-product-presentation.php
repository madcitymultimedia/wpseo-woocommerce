<?php
/**
 * WooCommerce Yoast SEO plugin file.
 *
 * @package WPSEO/WooCommerce
 */

use Yoast\WP\SEO\Generators\Generator_Interface;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class WPSEO_WooCommerce_Product_Presentation
 */
class WPSEO_WooCommerce_Product_Presentation extends Indexable_Presentation {

	/**
	 * A schema generator.
	 *
	 * @var Generator_Interface
	 */
	protected $schema_generator;

	/**
	 * Sets a custom schema generator.
	 *
	 * @param Generator_Interface $schema_generator The custom schema generator.
	 */
	public function set_schema_generator( $schema_generator ) {
		$this->schema_generator = $schema_generator;
	}

	/**
	 * Returns `false`, since it is not a prototype presentation.
	 *
	 * @return false not a prototype presentation.
	 */
	protected function is_prototype() {
		return false;
	}
}
