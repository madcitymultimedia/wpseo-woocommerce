<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_WooCommerce_Product_Brand_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Product_Brand_Presenter_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Product_Brand_Presenter
 *
 * @group presenters
 */
class Product_Brand_Presenter_Test extends TestCase {

	/**
	 * Holds the product.
	 *
	 * @var \WC_Product|\Mockery\MockInterface
	 */
	protected $product;

	/**
	 * Holds the product.
	 *
	 * @var \Yoast\WP\SEO\Helpers\Options_Helper|\Mockery\MockInterface
	 */
	protected $options;

	/**
	 * Holds the instance to test.
	 *
	 * @var WPSEO_WooCommerce_Product_Brand_Presenter
	 */
	protected $instance;

	/**
	 * Initializes the test setup.
	 */
	public function set_up() {
		parent::set_up();

		// Needs to exist as WPSEO_WooCommerce_Product_Brand_Presenter depends on it.
		Mockery::mock( 'overload:Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter' );

		$this->product = Mockery::mock( 'WC_Product' );

		$this->instance          = new WPSEO_WooCommerce_Product_Brand_Presenter( $this->product );
		$this->instance->helpers = (object) [
			'options' => Mockery::mock( 'Yoast\WP\SEO\Helpers\Options_Helper' ),
		];
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeEquals( $this->product, 'product', $this->instance );
	}

	/**
	 * Tests the tag format.
	 *
	 * @coversNothing
	 */
	public function test_tag_format() {
		$this->assertAttributeSame( '<meta property="product:brand" content="%s" />', 'tag_format', $this->instance );
	}

	/**
	 * Tests that the get function returns the first brand found.
	 *
	 * @covers ::get
	 * @covers ::get_brand_term_name
	 */
	public function test_get() {
		$schema_brand = 'test-brand';

		$this->instance->helpers->options
			->expects( 'get' )
			->once()
			->with( 'woo_schema_brand' )
			->andReturn( $schema_brand );

		// Tests for `get_brand_term_name`.
		$this->product->expects( 'get_id' )->andReturn( 1 );
		Mockery::mock( 'overload:WPSEO_Primary_Term' )
			->expects( 'get_primary_term' )
			->once()
			->andReturn( '' );
		Functions\expect( 'get_the_ID' )
			->once()
			->andReturn( 123 );
		Functions\expect( 'get_the_terms' )
			->once()
			->with( 123, $schema_brand )
			->andReturn(
				[
					(object) [ 'name' => 'first' ],
					(object) [ 'name' => 'second' ],
					(object) [ 'name' => 'third' ],
				]
			);

		$this->assertSame( 'first', $this->instance->get() );
	}

	/**
	 * Tests that the get function returns an empty string when no brands are found.
	 *
	 * @covers ::get
	 * @covers ::get_brand_term_name
	 */
	public function test_get_without_brands() {
		$schema_brand = 'test-brand';

		$this->instance->helpers->options
			->expects( 'get' )
			->once()
			->with( 'woo_schema_brand' )
			->andReturn( $schema_brand );

		// Tests for `get_brand_term_name`.
		$this->product->expects( 'get_id' )->andReturn( 1 );
		Mockery::mock( 'overload:WPSEO_Primary_Term' )
			->expects( 'get_primary_term' )
			->once()
			->andReturn( '' );
		Functions\expect( 'get_the_ID' )
			->once()
			->andReturn( 123 );
		Functions\expect( 'get_the_terms' )
			->once()
			->with( 123, $schema_brand )
			->andReturn( [] );

		$this->assertSame( '', $this->instance->get() );
	}

	/**
	 * Tests that the get function returns the primary brand.
	 *
	 * @covers ::get
	 * @covers ::get_brand_term_name
	 */
	public function test_get_primary_brand() {
		$schema_brand = 'test-brand';

		$this->instance->helpers->options
			->expects( 'get' )
			->once()
			->with( 'woo_schema_brand' )
			->andReturn( $schema_brand );

		// Tests for `get_brand_term_name`.
		$this->product->expects( 'get_id' )->andReturn( 1 );
		Mockery::mock( 'overload:WPSEO_Primary_Term' )
			->expects( 'get_primary_term' )
			->once()
			->andReturn( 'primary' );
		Functions\expect( 'get_term_by' )
			->once()
			->with( 'id', 'primary', 'test-brand' )
			->andReturn( (object) [ 'name' => 'primary term' ] );

		$this->assertSame( 'primary term', $this->instance->get() );
	}
}
