<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_WooCommerce_Product_Price_Amount_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Product_Price_Amount_Presenter_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Product_Price_Amount_Presenter
 *
 * @group presenters
 */
class Product_Price_Amount_Presenter_Test extends TestCase {

	/**
	 * Holds the product.
	 *
	 * @var \WC_Product|\Mockery\MockInterface
	 */
	protected $product;

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_WooCommerce_Product_Price_Amount_Presenter
	 */
	protected $instance;

	/**
	 * Initializes the test setup.
	 */
	public function set_up() {
		parent::set_up();

		// Needs to exist as WPSEO_WooCommerce_Abstract_Product_Presenter depends on it.
		Mockery::mock( 'overload:Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter' );

		$this->product = Mockery::mock( 'WC_Product' );

		$this->instance = new WPSEO_WooCommerce_Product_Price_Amount_Presenter( $this->product );
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
			'<meta property="product:price:amount" content="%s" />',
			$this->getPropertyValue( $this->instance, 'tag_format' )
		);
	}

	/**
	 * Tests that the display price is retrieved.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->product
			->expects( 'get_price' )
			->once()
			->andReturn( '11' );
		$this->product
			->expects( 'get_min_purchase_quantity' )
			->once()
			->andReturn( '1' );

		Functions\expect( 'wc_get_price_decimals' )->once()->andReturn( 0 );
		Functions\expect( 'wc_tax_enabled' )->once()->andReturn( false );
		Functions\expect( 'wc_format_decimal' )->once()->with( '11', 0 )->andReturn( 11 );

		$this->assertSame( '11', $this->instance->get() );
	}

	/**
	 * Tests that the display price is converted to a string.
	 *
	 * @covers ::get
	 */
	public function test_get_string_conversion() {
		$this->product
			->expects( 'get_price' )
			->once()
			->andReturn( '11' );
		$this->product
			->expects( 'get_min_purchase_quantity' )
			->once()
			->andReturn( '1' );

		Functions\expect( 'wc_get_price_decimals' )->once()->andReturn( 0 );
		Functions\expect( 'wc_tax_enabled' )->once()->andReturn( false );
		Functions\expect( 'wc_format_decimal' )->once()->with( '11', 0 )->andReturn( 11 );

		$actual = $this->instance->get();

		$this->assertSame( '11', $actual );
		$this->assertIsString( $actual );
	}
}
