<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Brain\Monkey\Filters;
use Mockery;
use WPSEO_WooCommerce_Product_Condition_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Product_Condition_Presenter_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Product_Condition_Presenter
 *
 * @group presenters
 */
class Product_Condition_Presenter_Test extends TestCase {

	/**
	 * Holds the product.
	 *
	 * @var \WC_Product|\Mockery\MockInterface
	 */
	protected $product;

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_WooCommerce_Product_Condition_Presenter
	 */
	protected $instance;

	/**
	 * Initializes the test setup.
	 */
	public function set_up() {
		parent::set_up();

		$this->product = Mockery::mock( 'WC_Product' );

		$this->instance = new WPSEO_WooCommerce_Product_Condition_Presenter( $this->product );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 * @covers \WPSEO_WooCommerce_Abstract_Product_Presenter::__construct
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
			'<meta property="product:condition" content="%s" />',
			$this->getPropertyValue( $this->instance, 'tag_format' )
		);
	}

	/**
	 * Tests that the filter is applied.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		Filters\expectApplied( 'Yoast\WP\Woocommerce\product_condition' )
			->once()
			->with( 'new', $this->product )
			->andReturn( 'condition' );

		$this->assertSame( 'condition', $this->instance->get() );
	}

	/**
	 * Tests that the filter output is converted to a string.
	 *
	 * @covers ::get
	 */
	public function test_get_string_conversion() {
		Filters\expectApplied( 'Yoast\WP\Woocommerce\product_condition' )
			->once()
			->with( 'new', $this->product )
			->andReturn( 123 );

		$actual = $this->instance->get();

		$this->assertSame( '123', $actual );
		$this->assertIsString( $actual );
	}
}
