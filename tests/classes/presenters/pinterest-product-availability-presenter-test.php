<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Mockery;
use WPSEO_WooCommerce_Pinterest_Product_Availability_Presenter;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Pinterest_Product_Availability_Presenter_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Pinterest_Product_Availability_Presenter
 *
 * @group presenters
 */
class Pinterest_Product_Availability_Presenter_Test extends TestCase {

	/**
	 * Holds the product.
	 *
	 * @var \WC_Product|\Mockery\MockInterface
	 */
	protected $product;

	/**
	 * Initializes the test setup.
	 */
	public function set_up() {
		parent::set_up();

		$this->product = Mockery::mock( 'WC_Product' );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 * @covers \WPSEO_WooCommerce_Abstract_Product_Availability_Presenter::__construct
	 * @covers \WPSEO_WooCommerce_Abstract_Product_Presenter::__construct
	 */
	public function test_construct() {
		$instance = new WPSEO_WooCommerce_Pinterest_Product_Availability_Presenter( $this->product, false, true );

		$this->assertSame( $this->product, $this->getPropertyValue( $instance, 'product' ) );
		$this->assertSame( false, $this->getPropertyValue( $instance, 'is_on_backorder' ) );
		$this->assertSame( true, $this->getPropertyValue( $instance, 'is_in_stock' ) );
	}

	/**
	 * Tests the tag format.
	 *
	 * @coversNothing
	 */
	public function test_tag_format() {
		$instance = new WPSEO_WooCommerce_Pinterest_Product_Availability_Presenter( $this->product, false );

		$this->assertSame(
			Abstract_Indexable_Tag_Presenter::META_PROPERTY_CONTENT,
			$this->getPropertyValue( $instance, 'tag_format' )
		);
	}

	/**
	 * Tests that the fallback is out of stock.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$instance = new WPSEO_WooCommerce_Pinterest_Product_Availability_Presenter( $this->product, false, false );

		$this->assertSame( 'out of stock', $instance->get() );
	}

	/**
	 * Tests on backorder.
	 *
	 * @covers ::get
	 */
	public function test_get_on_backorder() {
		$instance = new WPSEO_WooCommerce_Pinterest_Product_Availability_Presenter( $this->product, true );

		$this->assertSame( 'backorder', $instance->get() );
	}

	/**
	 * Tests in stock.
	 *
	 * @covers ::get
	 */
	public function test_get_in_stock() {
		$instance = new WPSEO_WooCommerce_Pinterest_Product_Availability_Presenter( $this->product, false, true );

		$this->assertSame( 'instock', $instance->get() );
	}
}
