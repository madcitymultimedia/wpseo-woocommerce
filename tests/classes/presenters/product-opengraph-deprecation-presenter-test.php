<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Brain\Monkey\Actions;
use Mockery;
use WPSEO_WooCommerce_Product_OpenGraph_Deprecation_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Product_OpenGraph_Deprecation_Presenter_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Product_OpenGraph_Deprecation_Presenter
 *
 * @group presenters
 */
class Product_OpenGraph_Deprecation_Presenter_Test extends TestCase {

	/**
	 * Holds the product.
	 *
	 * @var \WC_Product|\Mockery\MockInterface
	 */
	protected $product;

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_WooCommerce_Product_OpenGraph_Deprecation_Presenter
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

		$this->instance = new WPSEO_WooCommerce_Product_OpenGraph_Deprecation_Presenter( $this->product );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 * @covers \WPSEO_WooCommerce_Abstract_Product_Presenter::__construct
	 */
	public function test_construct() {
		$this->assertEquals( $this->product, $this->getPropertyValue( $this->instance, 'product' ) );
	}

	/**
	 * Tests that the action is done.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		Actions\did( 'Yoast\WP\Woocommerce\opengraph' );

		$this->assertSame( '', $this->instance->get() );
	}
}
