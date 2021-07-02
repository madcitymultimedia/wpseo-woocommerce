<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Mockery;
use WPSEO_WooCommerce_Product_Retailer_Item_ID_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Product_Retailer_Item_ID_Presenter_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Product_Retailer_Item_ID_Presenter
 *
 * @group presenters
 */
class Product_Retailer_Item_ID_Presenter_Test extends TestCase {

	/**
	 * Holds the product.
	 *
	 * @var \WC_Product|\Mockery\MockInterface
	 */
	protected $product;

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_WooCommerce_Product_Retailer_Item_ID_Presenter
	 */
	protected $instance;

	/**
	 * Initializes the test setup.
	 */
	public function set_up() {
		parent::set_up();

		$this->product = Mockery::mock( 'WC_Product' );

		$this->instance = new WPSEO_WooCommerce_Product_Retailer_Item_ID_Presenter( $this->product );
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
			'<meta property="product:retailer_item_id" content="%s" />',
			$this->getPropertyValue( $this->instance, 'tag_format' )
		);
	}

	/**
	 * Tests that the product SKU is retrieved.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->product
			->expects( 'get_sku' )
			->once()
			->andReturn( 'keeping stock' );

		$this->assertSame( 'keeping stock', $this->instance->get() );
	}
}
