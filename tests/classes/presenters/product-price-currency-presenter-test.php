<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Brain\Monkey\Functions;
use Mockery;
use WC_Product;
use WPSEO_WooCommerce_Product_Price_Currency_Presenter;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Product_Price_Currency_Presenter_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Product_Price_Currency_Presenter
 *
 * @group presenters
 */
class Product_Price_Currency_Presenter_Test extends TestCase {

	/**
	 * Holds the product.
	 *
	 * @var WC_Product|Mockery\MockInterface
	 */
	protected $product;

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_WooCommerce_Product_Price_Currency_Presenter
	 */
	protected $instance;

	/**
	 * Initializes the test setup.
	 */
	public function set_up() {
		parent::set_up();

		$this->product = Mockery::mock( 'WC_Product' );

		$this->instance = new WPSEO_WooCommerce_Product_Price_Currency_Presenter( $this->product );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertSame( $this->product, $this->getPropertyValue( $this->instance, 'product' ) );
	}

	/**
	 * Tests the tag format.
	 *
	 * @coversNothing
	 */
	public function test_tag_format() {
		$this->assertSame(
			Abstract_Indexable_Tag_Presenter::META_PROPERTY_CONTENT,
			$this->getPropertyValue( $this->instance, 'tag_format' )
		);
	}

	/**
	 * Tests that the currency is retrieved.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		Functions\expect( 'get_woocommerce_currency' )->once()->andReturn( 'EUR' );

		$this->assertSame( 'EUR', $this->instance->get() );
	}
}
