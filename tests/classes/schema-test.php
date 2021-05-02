<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey;
use Brain\Monkey\Functions;
use Mockery;
use WPSEO_WooCommerce_Schema;
use Yoast\WP\Woocommerce\Tests\Doubles\Schema_Double;
use Yoast\WP\Woocommerce\Tests\Mocks\Schema_IDs;
use Yoast\WPTestUtils\BrainMonkey\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Schema
 */
class Schema_Test extends TestCase {

	use YoastSEO;

	/**
	 * Test setup.
	 *
	 * Note: this test class doesn't extend the `Yoast\WP\Woocommerce\Tests\TestCase` class
	 * as the default stubs declared in the `Yoast\WPTestUtils\BrainMonkey\YoastTestCase` interfer
	 * with some mockery expectations set in the tests in this class.
	 *
	 * So, this test has to st the `get_option` and `get_site_option` expectations explicitly in this
	 * `set_up()` method as these are not inherited from the parent TestCase.
	 */
	public function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		if ( ! \defined( 'WC_VERSION' ) ) {
			// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound
			\define( 'WC_VERSION', '3.8.1' );
		}

		Monkey\Functions\expect( 'get_option' )
			->zeroOrMoreTimes()
			->with( Mockery::anyOf( 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ) )
			->andReturn( [] );

		Monkey\Functions\expect( 'get_site_option' )
			->zeroOrMoreTimes()
			->with( Mockery::anyOf( 'wpseo', 'wpseo_titles', 'wpseo_taxonomy_meta', 'wpseo_social', 'wpseo_ms' ) )
			->andReturn( [] );

		Mockery::mock( 'overload:Yoast\WP\SEO\Config\Schema_IDs', new Schema_IDs() );
		Mockery::mock( 'overload:Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter' );

		$this->set_instance();
	}

	/**
	 * Tests the class constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$schema = new WPSEO_WooCommerce_Schema( '3.9' );

		$this->assertSame( 10, \has_filter( 'woocommerce_structured_data_product', [ $schema, 'change_product' ] ) );
		$this->assertSame(
			10,
			\has_filter(
				'woocommerce_structured_data_type_for_page',
				[
					$schema,
					'remove_woo_breadcrumbs',
				]
			)
		);
		$this->assertSame( 10, \has_filter( 'wpseo_schema_webpage', [ $schema, 'filter_webpage' ] ) );
		$this->assertSame( 10, \has_action( 'wp_footer', [ $schema, 'output_schema_footer' ] ) );

		$this->assertFalse(
			\has_filter(
				'woocommerce_structured_data_review',
				[
					$schema,
					'change_reviewed_entity',
				]
			)
		);
	}

	/**
	 * Tests the class constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct_old_wc() {
		$schema = new WPSEO_WooCommerce_Schema( '3.8' );
		$this->assertSame( 10, \has_filter( 'woocommerce_structured_data_review', [ $schema, 'change_reviewed_entity' ] ) );
	}

	/**
	 * Test our Schema output in the footer.
	 *
	 * @covers ::output_schema_footer
	 */
	public function test_output_schema_footer() {
		$schema = new Schema_Double();

		$schema->data = [];
		self::assertFalse( $schema->output_schema_footer() );

		$data = [
			'@type' => 'Product',
			'@id'   => 'http://basic.wordpress.test/product/hippopotamus/#product',
			'name'  => 'Hippopotamus',
		];

		$utils = Mockery::mock( 'alias:WPSEO_Utils' );
		$utils->expects( 'format_json_encode' )
			->andReturnUsing(
				static function( $array ) {
					// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_json_encode -- Can't use it, since we are mocking it here.
					return \json_encode( $array );
				}
			);

		$schema->data = $data;
		$schema->output_schema_footer();

		$this->expectOutputContains( '<script type="application/ld+json" class="yoast-schema-graph yoast-schema-graph--woo yoast-schema-graph--footer">{"@context":"https:\/\/schema.org","@graph":[{"@type":"Product","@id":"http:\/\/basic.wordpress.test\/product\/hippopotamus\/#product","name":"Hippopotamus"}]}</script>' . PHP_EOL );
	}

	/**
	 * Test our Schema output in the footer.
	 *
	 * @covers ::filter_webpage
	 */
	public function test_filter_webpage() {
		Functions\stubs(
			[
				'is_product'           => false,
				'is_checkout'          => false,
				'is_checkout_pay_page' => false,
			]
		);

		$input  = [
			'@type' => 'WebPage',
		];
		$schema = new WPSEO_WooCommerce_Schema();
		$this->assertSame( $input, $schema->filter_webpage( $input ) );

		Functions\stubs(
			[
				'is_product'           => false,
				'is_checkout'          => true,
				'is_checkout_pay_page' => false,
			]
		);

		$expected = [
			'@type' => [ 'WebPage', 'CheckoutPage' ],
		];
		$schema   = new WPSEO_WooCommerce_Schema();
		$this->assertSame( $expected, $schema->filter_webpage( $input ) );

		Functions\stubs(
			[
				'is_product'           => true,
				'is_checkout'          => false,
				'is_checkout_pay_page' => false,
			]
		);

		$expected = [
			'@type' => [ 'WebPage', 'ItemPage' ],
		];
		$schema   = new WPSEO_WooCommerce_Schema();
		$this->assertSame( $expected, $schema->filter_webpage( $input ) );
	}

	/**
	 * Change review Schema test.
	 *
	 * @covers ::change_reviewed_entity
	 */
	public function test_change_reviewed_entity() {
		$schema = new Schema_Double();

		$input  = [
			'@type'         => 'Review',
			'itemReviewed'  => 'Product',
			'reviewContent' => 'is a dummy review',
		];
		$output = $schema->change_reviewed_entity( $input );

		$expected_output = [];
		$expected_data   = [
			'review' => [
				[
					'reviewContent' => 'is a dummy review',
				],
			],
		];

		$this->assertSame( $expected_output, $output );
		$this->assertSame( $expected_data, $schema->data );
	}

	/**
	 * Test filtering offers.
	 *
	 * @covers ::filter_offers
	 */
	public function test_filter_offers() {
		$schema = new Schema_Double();
		$input  = [
			'@type'       => 'Product',
			'name'        => 'Customizable responsive toolset',
			'url'         => 'https://example.com/product/customizable-responsive-toolset/',
			'description' => 'Sit debitis reprehenderit non rem natus. Corporis quidem quos et sit similique. Et ad hic exercitationem repudiandae rem laborum.\n\n\n\n\n\n\n\n\nCumque iusto cum enim ut. Et ipsum tempore dolorem ullam aspernatur autem et. Aut molestiae dolor natus. Ducimus molestias perspiciatis magni in libero deleniti ut. Rerum perspiciatis autem et maiores hic ducimus.\n\n\nAut tenetur ducimus distinctio quaerat deserunt sed. Sint ullam ut deserunt deleniti velit et. Incidunt in molestiae voluptas corrupti qui facilis quia.\n\n\n\n\n\nIste asperiores voluptas expedita id cupiditate. Sed error corrupti quibusdam dolor facere enim tenetur. Asperiores error qui commodi dolorem veritatis aspernatur.',
			'image'       => [
				'@id' => 'https://example.com/product/customizable-responsive-toolset/#primaryimage',
			],
			'sku'         => '209643',
			'offers'      => [
				[
					'@type'              => 'Offer',
					'price'              => '49.00',
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
					'priceCurrency'      => 'GBP',
					'availability'       => 'https://schema.org/InStock',
					'url'                => 'https://example.com/product/customizable-responsive-toolset/',
					'seller'             => [
						'@type' => 'Organization',
						'name'  => 'WooCommerce',
						'url'   => 'https://example.com',
					],
				],
			],
		];

		$expected_output                     = $input;
		$expected_output['offers'][0]['@id'] = 'https://example.com/#/schema/offer/209643-0';

		Functions\stubs(
			[
				'get_site_url'             => 'http://example.com',
				'wc_get_price_decimals'    => 2,
				'wc_tax_enabled'           => false,
				'wc_format_decimal'        => static function ( $number ) {
					return \number_format( $number, 2 );
				},
				'get_woocommerce_currency' => 'GBP',
				'wc_prices_include_tax'    => false,
			]
		);

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->once()->andReturn( '209643' );
		$product->expects( 'get_price' )->once()->andReturn( 49 );
		$product->expects( 'get_min_purchase_quantity' )->once()->andReturn( 1 );
		$product->expects( 'is_on_sale' )->once()->andReturn( false );
		$product->expects( 'is_on_backorder' )->once()->andReturn( false );

		$this->meta
			->expects( 'for_current_page' )
			->once()
			->andReturn( (object) [ 'site_url' => 'https://example.com/' ] );

		$output = $schema->filter_offers( $input, $product );

		$this->assertSame( $expected_output, $output );
	}

	/**
	 * Test filtering offers with product on backorder.
	 *
	 * @covers ::filter_offers
	 */
	public function test_filter_offers_with_product_on_backorder() {
		$schema = new Schema_Double();
		$input  = [
			'@type'       => 'Product',
			'name'        => 'Customizable responsive toolset',
			'url'         => 'https://example.com/product/customizable-responsive-toolset/',
			'description' => 'Sit debitis reprehenderit non rem natus. Corporis quidem quos et sit similique. Et ad hic exercitationem repudiandae rem laborum.\n\n\n\n\n\n\n\n\nCumque iusto cum enim ut. Et ipsum tempore dolorem ullam aspernatur autem et. Aut molestiae dolor natus. Ducimus molestias perspiciatis magni in libero deleniti ut. Rerum perspiciatis autem et maiores hic ducimus.\n\n\nAut tenetur ducimus distinctio quaerat deserunt sed. Sint ullam ut deserunt deleniti velit et. Incidunt in molestiae voluptas corrupti qui facilis quia.\n\n\n\n\n\nIste asperiores voluptas expedita id cupiditate. Sed error corrupti quibusdam dolor facere enim tenetur. Asperiores error qui commodi dolorem veritatis aspernatur.',
			'image'       => [
				'@id' => 'https://example.com/product/customizable-responsive-toolset/#primaryimage',
			],
			'sku'         => '209643',
			'offers'      => [
				[
					'@type'              => 'Offer',
					'price'              => '49.00',
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
					'priceCurrency'      => 'GBP',
					'availability'       => 'https://schema.org/PreOrder',
					'url'                => 'https://example.com/product/customizable-responsive-toolset/',
					'seller'             => [
						'@type' => 'Organization',
						'name'  => 'WooCommerce',
						'url'   => 'https://example.com',
					],
				],
			],
		];

		$expected_output                     = $input;
		$expected_output['offers'][0]['@id'] = 'https://example.com/#/schema/offer/209643-0';

		Functions\stubs(
			[
				'get_site_url'             => 'http://example.com',
				'wc_get_price_decimals'    => 2,
				'wc_tax_enabled'           => false,
				'wc_format_decimal'        => static function ( $number ) {
					return \number_format( $number, 2 );
				},
				'get_woocommerce_currency' => 'GBP',
				'wc_prices_include_tax'    => false,
			]
		);

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->once()->andReturn( '209643' );
		$product->expects( 'get_price' )->once()->andReturn( 49 );
		$product->expects( 'get_min_purchase_quantity' )->once()->andReturn( 1 );
		$product->expects( 'is_on_sale' )->once()->andReturn( false );
		$product->expects( 'is_on_backorder' )->once()->andReturn( true );

		$this->meta
			->expects( 'for_current_page' )
			->once()
			->andReturn( (object) [ 'site_url' => 'https://example.com/' ] );

		$output = $schema->filter_offers( $input, $product );

		$this->assertSame( $expected_output, $output );
	}

	/**
	 * Test filtering offers.
	 *
	 * @covers ::filter_offers
	 * @covers ::add_individual_offers
	 */
	public function test_filter_aggregate_offers() {
		$schema = new Schema_Double();
		$input  = [
			'@type'       => 'Product',
			'name'        => 'Customizable responsive toolset',
			'url'         => 'https://example.com/product/customizable-responsive-toolset/',
			'description' => 'Sit debitis reprehenderit non rem natus. Corporis quidem quos et sit similique. Et ad hic exercitationem repudiandae rem laborum.\n\n\n\n\n\n\n\n\nCumque iusto cum enim ut. Et ipsum tempore dolorem ullam aspernatur autem et. Aut molestiae dolor natus. Ducimus molestias perspiciatis magni in libero deleniti ut. Rerum perspiciatis autem et maiores hic ducimus.\n\n\nAut tenetur ducimus distinctio quaerat deserunt sed. Sint ullam ut deserunt deleniti velit et. Incidunt in molestiae voluptas corrupti qui facilis quia.\n\n\n\n\n\nIste asperiores voluptas expedita id cupiditate. Sed error corrupti quibusdam dolor facere enim tenetur. Asperiores error qui commodi dolorem veritatis aspernatur.',
			'image'       => [
				'@id' => 'https://example.com/product/customizable-responsive-toolset/#primaryimage',
			],
			'sku'         => 'sku209643',
			'offers'      => [
				[
					'@type'         => 'AggregateOffer',
					'lowPrice'      => '8.00',
					'highPrice'     => '12.00',
					'offerCount'    => 3,
					'priceCurrency' => 'GBP',
					'availability'  => 'https://schema.org/InStock',
					'url'           => 'https://example.com/product/customizable-responsive-toolset/',
					'seller'        => [
						'@type' => 'Organization',
						'name'  => 'WooCommerce',
						'url'   => 'https://example.com',
					],
				],
			],
		];

		$variants        = [
			[
				'attributes'            => [
					'attribute_pa_size' => 'l',
				],
				'availability_html'     => '',
				'backorders_allowed'    => false,
				'dimensions'            => [
					'length' => '',
					'width'  => '',
					'height' => '',
				],
				'dimensions_html'       => 'N/A',
				'display_price'         => 10,
				'display_regular_price' => 10,
				'image'                 => [
					'title'                   => 'jewelry5',
					'caption'                 => '',
					'url'                     => 'https://example.com/wp-content/uploads/2020/01/jewelry5.jpg',
					'alt'                     => '',
					'src'                     => 'https://example.com/wp-content/uploads/2020/01/jewelry5-416x312.jpg',
					'srcset'                  => 'https://example.com/wp-content/uploads/2020/01/jewelry5-416x312.jpg 416w, https://example.com/wp-content/uploads/2020/01/jewelry5-300x225.jpg 300w, https://example.com/wp-content/uploads/2020/01/jewelry5.jpg 640w',
					'sizes'                   => '(max-width: 416px) 100vw, 416px',
					'full_src'                => 'https://example.com/wp-content/uploads/2020/01/jewelry5.jpg',
					'full_src_w'              => 640,
					'full_src_h'              => 480,
					'gallery_thumbnail_src'   => 'https://example.com/wp-content/uploads/2020/01/jewelry5-100x100.jpg',
					'gallery_thumbnail_src_w' => 100,
					'gallery_thumbnail_src_h' => 100,
					'thumb_src'               => 'https://example.com/wp-content/uploads/2020/01/jewelry5-324x324.jpg',
					'thumb_src_w'             => 324,
					'thumb_src_h'             => 324,
					'src_w'                   => 416,
					'src_h'                   => 312,
				],
				'image_id'              => '17',
				'is_downloadable'       => false,
				'is_in_stock'           => true,
				'is_purchasable'        => true,
				'is_sold_individually'  => 'no',
				'is_virtual'            => false,
				'max_qty'               => '',
				'min_qty'               => 1,
				'price_html'            => '<span class=\'price\'><span class=\'woocommerce-Price-amount amount\'><span class=\'woocommerce-Price-currencySymbol\'>&pound;</span>10.00</span></span>',
				'sku'                   => '209643',
				'variation_description' => '',
				'variation_id'          => 330,
				'variation_is_active'   => true,
				'variation_is_visible'  => true,
				'weight'                => '',
				'weight_html'           => 'N/A',
			],
			[
				'attributes'            => [
					'attribute_pa_size' => 'm',
				],
				'availability_html'     => '',
				'backorders_allowed'    => false,
				'dimensions'            => [
					'length' => '',
					'width'  => '',
					'height' => '',
				],
				'dimensions_html'       => 'N/A',
				'display_price'         => 8,
				'display_regular_price' => 8,
				'image'                 => [
					'title'                   => 'jewelry5',
					'caption'                 => '',
					'url'                     => 'https://example.com/wp-content/uploads/2020/01/jewelry5.jpg',
					'alt'                     => '',
					'src'                     => 'https://example.com/wp-content/uploads/2020/01/jewelry5-416x312.jpg',
					'srcset'                  => 'https://example.com/wp-content/uploads/2020/01/jewelry5-416x312.jpg 416w, https://example.com/wp-content/uploads/2020/01/jewelry5-300x225.jpg 300w, https://example.com/wp-content/uploads/2020/01/jewelry5.jpg 640w',
					'sizes'                   => '(max-width: 416px) 100vw, 416px',
					'full_src'                => 'https://example.com/wp-content/uploads/2020/01/jewelry5.jpg',
					'full_src_w'              => 640,
					'full_src_h'              => 480,
					'gallery_thumbnail_src'   => 'https://example.com/wp-content/uploads/2020/01/jewelry5-100x100.jpg',
					'gallery_thumbnail_src_w' => 100,
					'gallery_thumbnail_src_h' => 100,
					'thumb_src'               => 'https://example.com/wp-content/uploads/2020/01/jewelry5-324x324.jpg',
					'thumb_src_w'             => 324,
					'thumb_src_h'             => 324,
					'src_w'                   => 416,
					'src_h'                   => 312,
				],
				'image_id'              => '17',
				'is_downloadable'       => false,
				'is_in_stock'           => true,
				'is_purchasable'        => true,
				'is_sold_individually'  => 'no',
				'is_virtual'            => false,
				'max_qty'               => '',
				'min_qty'               => 1,
				'price_html'            => '<span class=\'price\'><span class=\'woocommerce-Price-amount amount\'><span class=\'woocommerce-Price-currencySymbol\'>&pound;</span>8.00</span></span>',
				'sku'                   => '209643',
				'variation_description' => '',
				'variation_id'          => 331,
				'variation_is_active'   => true,
				'variation_is_visible'  => true,
				'weight'                => '',
				'weight_html'           => 'N/A',
			],
			[
				'attributes'            => [
					'attribute_pa_size' => 'xl',
				],
				'availability_html'     => '',
				'backorders_allowed'    => false,
				'dimensions'            => [
					'length' => '',
					'width'  => '',
					'height' => '',
				],
				'dimensions_html'       => 'N/A',
				'display_price'         => 12,
				'display_regular_price' => 12,
				'image'                 => [
					'title'                   => 'jewelry5',
					'caption'                 => '',
					'url'                     => 'https://example.com/wp-content/uploads/2020/01/jewelry5.jpg',
					'alt'                     => '',
					'src'                     => 'https://example.com/wp-content/uploads/2020/01/jewelry5-416x312.jpg',
					'srcset'                  => 'https://example.com/wp-content/uploads/2020/01/jewelry5-416x312.jpg 416w, https://example.com/wp-content/uploads/2020/01/jewelry5-300x225.jpg 300w, https://example.com/wp-content/uploads/2020/01/jewelry5.jpg 640w',
					'sizes'                   => '(max-width: 416px) 100vw, 416px',
					'full_src'                => 'https://example.com/wp-content/uploads/2020/01/jewelry5.jpg',
					'full_src_w'              => 640,
					'full_src_h'              => 480,
					'gallery_thumbnail_src'   => 'https://example.com/wp-content/uploads/2020/01/jewelry5-100x100.jpg',
					'gallery_thumbnail_src_w' => 100,
					'gallery_thumbnail_src_h' => 100,
					'thumb_src'               => 'https://example.com/wp-content/uploads/2020/01/jewelry5-324x324.jpg',
					'thumb_src_w'             => 324,
					'thumb_src_h'             => 324,
					'src_w'                   => 416,
					'src_h'                   => 312,
				],
				'image_id'              => '17',
				'is_downloadable'       => false,
				'is_in_stock'           => true,
				'is_purchasable'        => true,
				'is_sold_individually'  => 'no',
				'is_virtual'            => false,
				'max_qty'               => '',
				'min_qty'               => 1,
				'price_html'            => '<span class=\'price\'><span class=\'woocommerce-Price-amount amount\'><span class=\'woocommerce-Price-currencySymbol\'>&pound;</span>12.00</span></span>',
				'sku'                   => '209643',
				'variation_description' => '',
				'variation_id'          => 332,
				'variation_is_active'   => true,
				'variation_is_visible'  => true,
				'weight'                => '',
				'weight_html'           => 'N/A',
			],
		];
		$expected_output = [
			'@type'         => 'AggregateOffer',
			'lowPrice'      => '8.00',
			'highPrice'     => '12.00',
			'offerCount'    => 3,
			'priceCurrency' => 'GBP',
			'availability'  => 'https://schema.org/InStock',
			'url'           => 'https://example.com/product/customizable-responsive-toolset/',
			'seller'        => [
				'@type' => 'Organization',
				'name'  => 'WooCommerce',
				'url'   => 'https://example.com',
			],
			'@id'           => 'https://example.com/#/schema/aggregate-offer/209643-0',
			'offers'        => [
				[
					'@type'              => 'Offer',
					'@id'                => 'https://example.com/#/schema/offer/209643-0',
					'name'               => 'Customizable responsive toolset - l',
					'price'              => 10,
					'priceCurrency'      => 'GBP',
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
				],
				[
					'@type'              => 'Offer',
					'@id'                => 'https://example.com/#/schema/offer/209643-1',
					'name'               => 'Customizable responsive toolset - m',
					'price'              => 8,
					'priceCurrency'      => 'GBP',
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
				],
				[
					'@type'              => 'Offer',
					'@id'                => 'https://example.com/#/schema/offer/209643-2',
					'name'               => 'Customizable responsive toolset - xl',
					'price'              => 12,
					'priceCurrency'      => 'GBP',
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
				],
			],
		];

		Functions\stubs(
			[
				'get_site_url'             => 'https://example.com',
				'get_woocommerce_currency' => 'GBP',
				'wc_prices_include_tax'    => false,
				'wc_get_price_decimals'    => 2,
				'wc_format_decimal'        => null,
				'wc_tax_enabled'           => false,
			]
		);

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->twice()->andReturn( '209643' );
		$product->expects( 'get_available_variations' )->once()->andReturn( $variants );
		$product->expects( 'get_name' )->once()->andReturn( 'Customizable responsive toolset' );
		$product->expects( 'is_on_sale' )->once()->andReturn( false );
		$product->expects( 'is_on_backorder' )->once()->andReturn( false );

		$this->meta
			->expects( 'for_current_page' )
			->times( 4 )
			->andReturn( (object) [ 'site_url' => 'https://example.com/' ] );

		$output = $schema->filter_offers( $input, $product );

		$this->assertSame( $expected_output, $output['offers'][0] );
	}

	/**
	 * Test that removing Woo Breadcrumbs works.
	 *
	 * @covers ::remove_woo_breadcrumbs
	 */
	public function test_remove_woo_breadcrumbs() {
		$input    = [ 'webpage', 'breadcrumblist' ];
		$expected = [ 'webpage' ];

		$class = new WPSEO_WooCommerce_Schema();
		$this->assertSame( $expected, $class->remove_woo_breadcrumbs( $input ) );
	}

	/**
	 * Changing the seller in offers to point to our Organization ID when there's no org.
	 *
	 * @covers ::change_seller_in_offers
	 */
	public function test_change_seller_in_offers_no_organization() {
		$input = [
			'@type'       => 'Product',
			'@id'         => 'https://example.com/product/customizable-responsive-toolset/#product',
			'name'        => 'Customizable responsive toolset',
			'url'         => 'https://example.com/product/customizable-responsive-toolset/',
			'description' => 'Sit debitis reprehenderit non rem natus. Corporis quidem quos et sit similique. Et ad hic exercitationem repudiandae rem laborum.\n\n\n\n\n\n\n\n\nCumque iusto cum enim ut. Et ipsum tempore dolorem ullam aspernatur autem et. Aut molestiae dolor natus. Ducimus molestias perspiciatis magni in libero deleniti ut. Rerum perspiciatis autem et maiores hic ducimus.\n\n\nAut tenetur ducimus distinctio quaerat deserunt sed. Sint ullam ut deserunt deleniti velit et. Incidunt in molestiae voluptas corrupti qui facilis quia.\n\n\n\n\n\nIste asperiores voluptas expedita id cupiditate. Sed error corrupti quibusdam dolor facere enim tenetur. Asperiores error qui commodi dolorem veritatis aspernatur.',
			'image'       => [
				'@id' => 'https://example.com/product/customizable-responsive-toolset/#primaryimage',
			],
			'sku'         => '209643',
			'offers'      => [
				[
					'@type'         => 'AggregateOffer',
					'lowPrice'      => '8.00',
					'highPrice'     => '12.00',
					'offerCount'    => 3,
					'priceCurrency' => 'GBP',
					'availability'  => 'https://schema.org/InStock',
					'url'           => 'https://example.com/product/customizable-responsive-toolset/',
					'seller'        => [
						'@type' => 'Organization',
						'name'  => 'WooCommerce',
						'url'   => 'https://example.com',
					],
					'@id'           => 'https://example.com/#/schema/aggregate-offer/24-0',
				],
			],
		];

		$options = Mockery::mock( 'alias:WPSEO_Options' );
		$options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( false );
		$options->expects( 'get' )->once()->with( 'company_name' )->andReturn( 'Yoast BV' );

		Mockery::getConfiguration()->setConstantsMap(
			[
				'WPSEO_Schema_IDs' => [
					'ORGANIZATION_HASH'  => '#organization',
					'WEBPAGE_HASH'       => '#webpage',
					'PRIMARY_IMAGE_HASH' => '#primaryimage',
				],
			]
		);
		Mockery::mock( 'alias:WPSEO_Schema_IDs' );

		$expected = $input;
		$schema   = new Schema_Double();
		$output   = $schema->change_seller_in_offers( $input );

		$this->assertSame( $expected, $output );
	}

	/**
	 * Changing the seller in offers to point to our Organization ID
	 *
	 * @covers ::change_seller_in_offers
	 */
	public function test_change_seller_in_offers() {
		$input = [
			'@type'       => 'Product',
			'@id'         => 'https://example.com/product/customizable-responsive-toolset/#product',
			'name'        => 'Customizable responsive toolset',
			'url'         => 'https://example.com/product/customizable-responsive-toolset/',
			'description' => 'Sit debitis reprehenderit non rem natus. Corporis quidem quos et sit similique. Et ad hic exercitationem repudiandae rem laborum.\n\n\n\n\n\n\n\n\nCumque iusto cum enim ut. Et ipsum tempore dolorem ullam aspernatur autem et. Aut molestiae dolor natus. Ducimus molestias perspiciatis magni in libero deleniti ut. Rerum perspiciatis autem et maiores hic ducimus.\n\n\nAut tenetur ducimus distinctio quaerat deserunt sed. Sint ullam ut deserunt deleniti velit et. Incidunt in molestiae voluptas corrupti qui facilis quia.\n\n\n\n\n\nIste asperiores voluptas expedita id cupiditate. Sed error corrupti quibusdam dolor facere enim tenetur. Asperiores error qui commodi dolorem veritatis aspernatur.',
			'image'       => [
				'@id' => 'https://example.com/product/customizable-responsive-toolset/#primaryimage',
			],
			'sku'         => '209643',
			'offers'      => [
				[
					'@type'         => 'AggregateOffer',
					'lowPrice'      => '8.00',
					'highPrice'     => '12.00',
					'offerCount'    => 3,
					'priceCurrency' => 'GBP',
					'availability'  => 'https://schema.org/InStock',
					'url'           => 'https://example.com/product/customizable-responsive-toolset/',
					'seller'        => [
						'@type' => 'Organization',
						'name'  => 'WooCommerce',
						'url'   => 'https://example.com',
					],
					'@id'           => 'https://example.com/#/schema/aggregate-offer/24-0',
				],
			],
		];

		$options = Mockery::mock( 'alias:WPSEO_Options' );
		$options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );
		$options->expects( 'get' )->once()->with( 'company_name' )->andReturn( 'Yoast BV' );

		$this->meta
			->expects( 'for_current_page' )
			->once()
			->andReturn( (object) [ 'site_url' => 'https://example.com/' ] );

		$expected                        = $input;
		$expected['offers'][0]['seller'] = [ '@id' => 'https://example.com/#organization' ];
		$schema                          = new Schema_Double();
		$output                          = $schema->change_seller_in_offers( $input );

		$this->assertSame( $expected, $output );
	}

	/**
	 * Test if our review filtering works and leaves empty reviews unchanged.
	 *
	 * @covers ::filter_reviews
	 */
	public function test_filter_reviews_empty() {
		$input   = [
			'review' => [],
		];
		$schema  = new Schema_Double();
		$product = Mockery::mock( 'WC_Product' );

		$output = $schema->filter_reviews( $input, $product );

		$this->assertSame( $input, $output );
	}

	/**
	 * Tests we remove the SKU when WooCommerce fallbacks to the product's ID.
	 *
	 * @covers ::filter_sku
	 */
	public function test_filter_sku_empty() {
		$schema  = new Schema_Double();
		$product = Mockery::mock( 'WC_Product' );

		// The WooCommerce SKU input field is empty.
		$product->expects( 'get_sku' )->once()->andReturn( '' );
		// WooCommerce fallbacks to the products'ID.
		$woocommeerce_sku_fallback = [
			'sku' => '12345',
		];

		$output = $schema->filter_sku( $woocommeerce_sku_fallback, $product );

		$this->assertEmpty( $output );
	}

	/**
	 * Test adding the global identifier
	 *
	 * @covers ::add_global_identifier
	 */
	public function test_add_global_identifier_false() {
		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->once()->andReturn( 123 );

		Functions\stubs(
			[
				'get_post_meta' => false,
			]
		);

		$schema = new Schema_Double();

		$this->assertFalse( $schema->add_global_identifier( $product ) );
	}

	/**
	 * Test adding the global identifier
	 *
	 * @covers ::add_global_identifier
	 */
	public function test_add_global_identifier_gtin() {
		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->once()->andReturn( 123 );

		$data = [
			'gtin8' => '123',
		];

		Functions\stubs(
			[
				'get_post_meta' => $data,
			]
		);

		$schema = new Schema_Double();
		$schema->add_global_identifier( $product );

		$this->assertSame( $data, $schema->data );
	}

	/**
	 * Test adding an ISBN number.
	 *
	 * @covers ::add_global_identifier
	 */
	public function test_add_global_identifier_isbn() {
		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->once()->andReturn( 123 );

		$data = [
			'isbn' => '978-3-16-148410-0',
		];

		Functions\stubs(
			[
				'get_post_meta' => $data,
			]
		);

		$schema = new Schema_Double();
		$schema->add_global_identifier( $product );

		$expected = [
			'isbn'  => '978-3-16-148410-0',
			'@type' => [ 'Book', 'Product' ],
		];
		$this->assertSame( $expected, $schema->data );
	}

	/**
	 * Test if our review filtering works.
	 *
	 * @covers ::filter_reviews
	 */
	public function test_filter_reviews() {
		$input = [
			'review' => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => '2',
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Fleta Herman',
					],
					'reviewBody'    => 'Et eum odit nihil voluptas. Repudiandae expedita possimus quam quos ab dolorem rerum. Quam impedit omnis voluptatum commodi aliquid. Accusantium cumque qui sequi deleniti voluptate quia.',
					'datePublished' => '2020-01-14T14:02:48+00:00',
				],
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => '5',
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Prof. Alexane Luettgen',
					],
					'reviewBody'    => 'Omnis id tempore quae dolor in. Sunt aliquam rem animi. Repellendus porro voluptatem ut id illo veritatis ullam voluptatum.',
					'datePublished' => '2020-01-14T14:02:47+00:00',
				],
			],
		];

		Functions\stubs(
			[
				'get_site_url' => 'https://example.com',
			]
		);
		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->once()->andReturn( 24 );
		$product->expects( 'get_name' )->once()->andReturn( 'Example product' );

		$this->meta
			->expects( 'for_current_page' )
			->times( 2 )
			->andReturn( (object) [ 'site_url' => 'https://example.com/' ] );

		$schema = new Schema_Double();
		$output = $schema->filter_reviews( $input, $product );

		$expected = [
			'review' => [
				'0' => [
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => '2',
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Fleta Herman',
					],
					'reviewBody'    => 'Et eum odit nihil voluptas. Repudiandae expedita possimus quam quos ab dolorem rerum. Quam impedit omnis voluptatum commodi aliquid. Accusantium cumque qui sequi deleniti voluptate quia.',
					'datePublished' => '2020-01-14T14:02:48+00:00',
					'@id'           => 'https://example.com/#/schema/review/24-0',
					'name'          => 'Example product',
				],
				'1' => [
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => '5',
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Prof. Alexane Luettgen',
					],
					'reviewBody'    => 'Omnis id tempore quae dolor in. Sunt aliquam rem animi. Repellendus porro voluptatem ut id illo veritatis ullam voluptatum.',
					'datePublished' => '2020-01-14T14:02:47+00:00',
					'@id'           => 'https://example.com/#/schema/review/24-1',
					'name'          => 'Example product',
				],
			],
		];

		$this->assertSame( $expected, $output );
	}

	/**
	 * Tests that should_output_yoast_schema returns the right value.
	 *
	 * @covers ::should_output_yoast_schema
	 */
	public function test_should_output_yoast_schema() {
		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )->once()->andReturn( true );

		$actual = WPSEO_WooCommerce_Schema::should_output_yoast_schema();
		$this->assertTrue( $actual );

		Monkey\Filters\expectApplied( 'wpseo_json_ld_output' )->once()->andReturn( false );

		$actual = WPSEO_WooCommerce_Schema::should_output_yoast_schema();
		$this->assertFalse( $actual );
	}

	/**
	 * Tests that the schema data after change product is as expected.
	 *
	 * @covers ::change_product
	 * @covers ::add_image
	 * @covers ::add_brand
	 * @covers ::add_manufacturer
	 * @covers ::add_color
	 * @covers ::add_organization_for_attribute
	 */
	public function test_change_product() {
		$product_id   = 1;
		$product_name = 'TestProduct';
		$product_sku  = 'sku1234';
		$base_url     = 'http://local.wordpress.test/';
		$canonical    = $base_url . 'product/test/';

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->times( 6 )->with()->andReturn( $product_id );
		$product->expects( 'get_name' )->once()->with()->andReturn( $product_name );
		$product->expects( 'get_sku' )->once()->with()->andReturn( $product_sku );
		$product->expects( 'get_price' )->once()->with()->andReturn( 1 );
		$product->expects( 'get_min_purchase_quantity' )->once()->with()->andReturn( 1 );
		$product->expects( 'is_on_sale' )->once()->andReturn( false );
		$product->expects( 'is_on_backorder' )->once()->andReturn( false );

		$mock = Mockery::mock( 'alias:WPSEO_Options' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_brand' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_manufacturer' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_color' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );
		$mock->expects( 'get' )->once()->with( 'company_name' )->andReturn( 'WP' );

		Functions\stubs(
			[
				'has_post_thumbnail'       => true,
				'home_url'                 => $base_url,
				'get_site_url'             => $base_url,
				'get_post_meta'            => false,
				'get_the_terms'            => false,
				'wc_placeholder_img_src'   => $base_url . 'example_image.jpg',
				'wc_get_price_decimals'    => 2,
				'wc_tax_enabled'           => false,
				'wc_format_decimal'        => static function ( $number ) {
					return \number_format( $number, 2 );
				},
				'get_woocommerce_currency' => 'GBP',
				'wc_prices_include_tax'    => false,
			]
		);

		$instance = Mockery::mock( Schema_Double::class )->makePartial();
		$instance->expects( 'get_primary_term_or_first_term' )
			->twice()
			->with( 'product_cat', 1 )
			->andReturn( (object) [ 'name' => $product_name ] );

		$image_data   = [
			'url'    => $base_url . '/example_image.jpg',
			'width'  => 50,
			'height' => 50,
		];
		$schema_image = Mockery::mock( 'overload:WPSEO_Schema_Image' );
		$schema_image->expects( '__construct' )
			->once()
			->with( $canonical . '#woocommerceimageplaceholder' )
			->andReturnSelf();
		$schema_image->expects( 'generate_from_url' )
			->once()
			->with( $base_url . '/example_image.jpg' )
			->andReturn( $image_data );

		Functions\expect( 'wp_strip_all_tags' )->twice()->andReturn( 'TestProduct' );

		$data = [
			'@type'       => 'Product',
			'@id'         => $canonical . '#product',
			'name'        => $product_name,
			'url'         => $canonical,
			'image'       => false,
			'description' => '',
			'sku'         => 'sku1234',
			'offers'      => [
				[
					'@type'              => 'Offer',
					'price'              => '1.00',
					'url'                => $canonical,
					'seller'             => [
						'@type' => 'Organization',
						'name'  => 'WP',
						'url'   => $base_url,
					],
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
				],
			],
			'review'      => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => 5,
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Joost de Valk',
					],
					'reviewBody'    => 'Product review',
					'datePublished' => '2020-01-07T13:36:12+00:00',
				],
			],
		];

		Monkey\Filters\expectApplied( 'wpseo_schema_product' )->once();

		$expected = [
			'@type'            => 'Product',
			'@id'              => $canonical . '#product',
			'name'             => $product_name,
			'url'              => $canonical,
			'description'      => '',
			'sku'              => 'sku1234',
			'offers'           => [
				[
					'@type'              => 'Offer',
					'price'              => '1.00',
					'url'                => $canonical,
					'seller'             => [
						'@id' => $base_url . '#organization',
					],
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
					'@id'                => $base_url . '#/schema/offer/1-0',
					'priceCurrency'      => 'GBP',
				],
			],
			'review'           => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => 5,
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Joost de Valk',
					],
					'reviewBody'    => 'Product review',
					'datePublished' => '2020-01-07T13:36:12+00:00',
					'@id'           => $base_url . '#/schema/review/' . $product_id . '-0',
					'name'          => $product_name,
				],
			],
			'mainEntityOfPage' => [ '@id' => $canonical . '#webpage' ],
			'image'            => [ '@id' => $canonical . '#primaryimage' ],
			'brand'            => [
				'@type' => 'Organization',
				'name'  => $product_name,
			],
			'manufacturer'     => [
				'@type' => 'Organization',
				'name'  => $product_name,
			],
		];

		$this->meta
			->expects( 'for_current_page' )
			->times( 5 )
			->andReturn(
				(object) [
					'site_url'  => $base_url,
					'canonical' => $canonical,
				]
			);

		$instance->change_product( $data, $product );
		$this->assertSame( $expected, $instance->data );
	}

	/**
	 * Tests that the schema data after change product is as expected.
	 *
	 * @covers ::change_product
	 * @covers ::add_image
	 * @covers ::add_brand
	 * @covers ::add_manufacturer
	 * @covers ::add_color
	 * @covers ::add_organization_for_attribute
	 */
	public function test_change_product_no_thumb() {
		$product_id   = 1;
		$product_name = 'TestProduct';
		$product_sku  = 'sku1234';
		$base_url     = 'http://local.wordpress.test/';
		$canonical    = $base_url . 'product/test/';

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->times( 6 )->with()->andReturn( $product_id );
		$product->expects( 'get_name' )->once()->with()->andReturn( $product_name );
		$product->expects( 'get_sku' )->once()->with()->andReturn( $product_sku );
		$product->expects( 'get_price' )->once()->andReturn( 1 );
		$product->expects( 'get_min_purchase_quantity' )->once()->andReturn( 1 );
		$product->expects( 'is_on_sale' )->once()->andReturn( false );
		$product->expects( 'is_on_backorder' )->once()->andReturn( false );

		$mock = Mockery::mock( 'alias:WPSEO_Options' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_brand' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_manufacturer' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_color' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );
		$mock->expects( 'get' )->once()->with( 'company_name' )->andReturn( 'WP' );

		Functions\stubs(
			[
				'has_post_thumbnail'       => false,
				'get_post_meta'            => false,
				'get_the_terms'            => false,
				'wc_placeholder_img_src'   => $base_url . 'example_image.jpg',
				'wc_get_price_decimals'    => 2,
				'wc_tax_enabled'           => false,
				'wc_format_decimal'        => static function ( $number ) {
					return \number_format( $number, 2 );
				},
				'get_woocommerce_currency' => 'GBP',
				'wc_prices_include_tax'    => false,
			]
		);

		$instance = Mockery::mock( Schema_Double::class )->makePartial();
		$instance->expects( 'get_primary_term_or_first_term' )
			->twice()
			->with( 'product_cat', 1 )
			->andReturn( (object) [ 'name' => $product_name ] );

		$image_data = [
			'@type'  => 'ImageObject',
			'@id'    => $canonical . '#woocommerceimageplaceholder',
			'url'    => $base_url . 'example_image.jpg',
			'width'  => 50,
			'height' => 50,
		];

		$this->meta
			->expects( 'for_current_page' )
			->times( 5 )
			->andReturn(
				(object) [
					'site_url'  => $base_url,
					'canonical' => $canonical,
				]
			);

		$this->helpers->schema->image
			->expects( 'generate_from_url' )
			->with( $image_data['@id'], $image_data['url'] )
			->andReturn( $image_data );

		Functions\expect( 'wp_strip_all_tags' )->twice()->andReturn( 'TestProduct' );

		$data = [
			'@type'       => 'Product',
			'@id'         => $canonical . '#product',
			'name'        => $product_name,
			'url'         => $canonical,
			'image'       => false,
			'description' => '',
			'sku'         => 'sku1234',
			'offers'      => [
				[
					'@type'              => 'Offer',
					'price'              => '1.00',
					'url'                => $canonical,
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
					'seller'             => [
						'@type' => 'Organization',
						'name'  => 'WP',
						'url'   => $base_url,
					],
				],
			],
			'review'      => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => 5,
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Joost de Valk',
					],
					'reviewBody'    => 'Product review',
					'datePublished' => '2020-01-07T13:36:12+00:00',
				],
			],
		];

		$expected = [
			'@type'            => 'Product',
			'@id'              => $canonical . '#product',
			'name'             => $product_name,
			'url'              => $canonical,
			'description'      => '',
			'sku'              => 'sku1234',
			'offers'           => [
				[
					'@type'              => 'Offer',
					'price'              => '1.00',
					'url'                => $canonical,
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
					'seller'             => [
						'@id' => $base_url . '#organization',
					],
					'@id'                => $base_url . '#/schema/offer/1-0',
					'priceCurrency'      => 'GBP',
				],
			],
			'review'           => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => 5,
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Joost de Valk',
					],
					'reviewBody'    => 'Product review',
					'datePublished' => '2020-01-07T13:36:12+00:00',
					'@id'           => $base_url . '#/schema/review/' . $product_id . '-0',
					'name'          => $product_name,
				],
			],
			'mainEntityOfPage' => [ '@id' => $canonical . '#webpage' ],
			'image'            => [
				'@type'  => 'ImageObject',
				'@id'    => $canonical . '#woocommerceimageplaceholder',
				'url'    => $base_url . 'example_image.jpg',
				'width'  => 50,
				'height' => 50,
			],
			'brand'            => [
				'@type' => 'Organization',
				'name'  => $product_name,
			],
			'manufacturer'     => [
				'@type' => 'Organization',
				'name'  => $product_name,
			],
		];

		$instance->change_product( $data, $product );
		$this->assertSame( $expected, $instance->data );
	}

	/**
	 * Tests that the schema data after change product is as expected.
	 *
	 * @covers ::change_product
	 * @covers ::add_image
	 * @covers ::add_brand
	 * @covers ::add_manufacturer
	 * @covers ::add_color
	 * @covers ::add_organization_for_attribute
	 */
	public function test_change_product_with_color() {
		$product_id   = 1;
		$product_name = 'TestProduct';
		$product_sku  = 'sku1234';
		$base_url     = 'http://local.wordpress.test/';
		$canonical    = $base_url . 'product/test/';

		Functions\expect( 'wp_strip_all_tags' )->twice()->andReturn( 'TestProduct' );

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->times( 6 )->with()->andReturn( $product_id );
		$product->expects( 'get_name' )->once()->with()->andReturn( $product_name );
		$product->expects( 'get_sku' )->once()->with()->andReturn( $product_sku );
		$product->expects( 'get_price' )->once()->with()->andReturn( 1 );
		$product->expects( 'get_min_purchase_quantity' )->once()->with()->andReturn( 1 );
		$product->expects( 'is_on_sale' )->once()->andReturn( false );
		$product->expects( 'is_on_backorder' )->once()->andReturn( false );

		$mock = Mockery::mock( 'alias:WPSEO_Options' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_brand' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_manufacturer' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'woo_schema_color' )->andReturn( 'product_cat' );
		$mock->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );
		$mock->expects( 'get' )->once()->with( 'company_name' )->andReturn( 'WP' );

		Functions\stubs(
			[
				'has_post_thumbnail'       => true,
				'get_post_meta'            => false,
				'get_the_terms'            => [
					(object) [ 'name' => 'green' ],
					(object) [ 'name' => 'white' ],
					(object) [ 'name' => 'red' ],
					(object) [ 'name' => 'UPPERCASECOLOR' ],
				],
				'wc_get_price_decimals'    => 2,
				'wc_tax_enabled'           => false,
				'wc_format_decimal'        => static function ( $number ) {
					return \number_format( $number, 2 );
				},
				'get_woocommerce_currency' => 'GBP',
			]
		);

		$instance = Mockery::mock( Schema_Double::class )->makePartial();
		$instance->expects( 'get_primary_term_or_first_term' )
			->twice()
			->with( 'product_cat', 1 )
			->andReturn( (object) [ 'name' => $product_name ] );

		$this->meta
			->expects( 'for_current_page' )
			->times( 5 )
			->andReturn(
				(object) [
					'site_url'  => $base_url,
					'canonical' => $canonical,
				]
			);

		$this->helpers->schema->image
			->expects( 'generate_from_url' )
			->never();

		$data = [
			'@type'       => 'Product',
			'@id'         => $canonical . '#product',
			'name'        => $product_name,
			'url'         => $canonical,
			'image'       => false,
			'description' => '',
			'sku'         => 'sku1234',
			'offers'      => [
				[
					'@type'  => 'Offer',
					'price'  => '1.00',
					'url'    => $canonical,
					'seller' => [
						'@type' => 'Organization',
						'name'  => 'WP',
						'url'   => $base_url,
					],
				],
			],
			'review'      => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => 5,
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Joost de Valk',
					],
					'reviewBody'    => 'Product review',
					'datePublished' => '2020-01-07T13:36:12+00:00',
				],
			],
		];

		$expected = [
			'@type'            => 'Product',
			'@id'              => $canonical . '#product',
			'name'             => $product_name,
			'url'              => $canonical,
			'description'      => '',
			'sku'              => 'sku1234',
			'offers'           => [
				[
					'@type'              => 'Offer',
					'price'              => '1.00',
					'url'                => $canonical,
					'seller'             => [
						'@id' => $base_url . '#organization',
					],
					'@id'                => $base_url . '#/schema/offer/1-0',
					'priceCurrency'      => 'GBP',
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
				],
			],
			'review'           => [
				[
					'@type'         => 'Review',
					'reviewRating'  => [
						'@type'       => 'Rating',
						'ratingValue' => 5,
					],
					'author'        => [
						'@type' => 'Person',
						'name'  => 'Joost de Valk',
					],
					'reviewBody'    => 'Product review',
					'datePublished' => '2020-01-07T13:36:12+00:00',
					'@id'           => $base_url . '#/schema/review/' . $product_id . '-0',
					'name'          => $product_name,
				],
			],
			'mainEntityOfPage' => [ '@id' => $canonical . '#webpage' ],
			'image'            => [ '@id' => $canonical . '#primaryimage' ],
			'brand'            => [
				'@type' => 'Organization',
				'name'  => $product_name,
			],
			'manufacturer'     => [
				'@type' => 'Organization',
				'name'  => $product_name,
			],
			'color'            => [
				'green',
				'white',
				'red',
				'uppercasecolor',
			],
		];

		$instance->change_product( $data, $product );
		$this->assertSame( $expected, $instance->data );
	}

	/**
	 * Tests that get_primary_term_or_first_term returns the primary term.
	 *
	 * @covers ::get_primary_term_or_first_term
	 */
	public function test_get_primary_term_or_first_term_expecting_primary_term() {
		$id            = 1;
		$taxonomy_name = 'product_cat';
		$wp_term       = Mockery::mock( 'WP_Term' );

		$primary_term = Mockery::mock( 'overload:WPSEO_Primary_Term' );
		$primary_term->expects( 'get_primary_term' )->once()->with()->andReturn( $id );

		Functions\expect( 'get_term' )->once()->with( $id )->andReturn( $wp_term );
		Functions\expect( 'get_the_terms' )->never()->withAnyArgs();

		$instance = new Schema_Double();
		$actual   = $instance->get_primary_term_or_first_term( $taxonomy_name, $id );

		$this->assertSame( $wp_term, $actual );
	}

	/**
	 * Tests that get_primary_term_or_first_term returns the first term.
	 *
	 * @covers ::get_primary_term_or_first_term
	 */
	public function test_get_primary_term_or_first_term_expecting_first_term() {
		$id            = 1;
		$taxonomy_name = 'product_cat';
		$wp_term       = Mockery::mock( 'WP_Term' );

		$primary_term = Mockery::mock( 'overload:WPSEO_Primary_Term' );
		$primary_term->expects( 'get_primary_term' )->once()->with()->andReturn( false );

		Functions\expect( 'get_term' )
			->never()
			->withAnyArgs();

		Functions\expect( 'get_the_terms' )
			->once()
			->with( $id, $taxonomy_name )
			->andReturn(
				[
					$wp_term,
					'other term',
				]
			);

		$instance = new Schema_Double();
		$actual   = $instance->get_primary_term_or_first_term( $taxonomy_name, $id );

		$this->assertSame( $wp_term, $actual );
	}

	/**
	 * Tests that get_primary_term_or_first_term returns the first term.
	 *
	 * @covers ::get_primary_term_or_first_term
	 */
	public function test_get_primary_term_or_first_term_without_terms() {
		$id            = 1;
		$taxonomy_name = 'product_cat';

		$primary_term = Mockery::mock( 'overload:WPSEO_Primary_Term' );
		$primary_term->expects( 'get_primary_term' )->once()->with()->andReturn( false );

		Functions\expect( 'get_term' )->never()->withAnyArgs();
		Functions\expect( 'get_the_terms' )->once()->with( $id, $taxonomy_name )->andReturn( [] );

		$instance = new Schema_Double();
		$actual   = $instance->get_primary_term_or_first_term( $taxonomy_name, $id );

		$this->assertNull( $actual );
	}

	/**
	 * Tests filtering offers with a product on sale and sale price dates should output a `priceValidUntil` property.
	 *
	 * @covers ::filter_offers
	 */
	public function test_filter_offers_with_product_on_sale_should_output_price_valid_until() {
		$schema = new Schema_Double();
		$input  = [
			'@type'       => 'Product',
			'name'        => 'Customizable responsive toolset',
			'url'         => 'https://example.com/product/customizable-responsive-toolset/',
			'description' => 'Sit debitis reprehenderit non rem natus. Corporis quidem quos et sit similique. Et ad hic exercitationem repudiandae rem laborum.\n\n\n\n\n\n\n\n\nCumque iusto cum enim ut. Et ipsum tempore dolorem ullam aspernatur autem et. Aut molestiae dolor natus. Ducimus molestias perspiciatis magni in libero deleniti ut. Rerum perspiciatis autem et maiores hic ducimus.\n\n\nAut tenetur ducimus distinctio quaerat deserunt sed. Sint ullam ut deserunt deleniti velit et. Incidunt in molestiae voluptas corrupti qui facilis quia.\n\n\n\n\n\nIste asperiores voluptas expedita id cupiditate. Sed error corrupti quibusdam dolor facere enim tenetur. Asperiores error qui commodi dolorem veritatis aspernatur.',
			'image'       => [
				'@id' => 'https://example.com/product/customizable-responsive-toolset/#primaryimage',
			],
			'sku'         => '209643',
			'offers'      => [
				[
					'@type'              => 'Offer',
					'price'              => '49.00',
					'priceValidUntil'    => '2020-03-24',
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
					'priceCurrency'      => 'GBP',
					'availability'       => 'https://schema.org/InStock',
					'url'                => 'https://example.com/product/customizable-responsive-toolset/',
					'seller'             => [
						'@type' => 'Organization',
						'name'  => 'WooCommerce',
						'url'   => 'https://example.com',
					],
				],
			],
		];

		$expected_output                     = $input;
		$expected_output['offers'][0]['@id'] = 'http://example.com/#/schema/offer/209643-0';

		Functions\stubs(
			[
				'wc_get_price_decimals'    => 2,
				'wc_tax_enabled'           => false,
				'wc_format_decimal'        => static function ( $number ) {
					return \number_format( $number, 2 );
				},
				'get_woocommerce_currency' => 'GBP',
			]
		);

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->once()->andReturn( '209643' );
		$product->expects( 'get_price' )->once()->andReturn( 49 );
		$product->expects( 'get_min_purchase_quantity' )->once()->andReturn( 1 );
		$product->expects( 'is_on_sale' )->once()->andReturn( true );
		$product->expects( 'get_date_on_sale_to' )->once()->andReturn( 'not-a-null-value' );
		$product->expects( 'is_on_backorder' )->once()->andReturn( false );

		$this->meta
			->expects( 'for_current_page' )
			->once()
			->andReturn( (object) [ 'site_url' => 'http://example.com/' ] );

		$output = $schema->filter_offers( $input, $product );

		$this->assertSame( $expected_output, $output );
	}

	/**
	 * Tests that the article publisher and article author presenters are removed as expected.
	 *
	 * @covers ::remove_unneeded_presenters
	 */
	public function test_remove_unneeded_presenters() {
		$presenters = [
			Mockery::mock( 'Yoast\WP\SEO\Presenters\Open_Graph\Article_Publisher_Presenter' ),
			Mockery::mock( 'Yoast\WP\SEO\Presenters\Open_Graph\Article_Author_Presenter' ),
		];

		Functions\expect( 'is_product' )
			->once()
			->andReturn( true );

		$instance = new WPSEO_WooCommerce_Schema();

		$this->assertEmpty( $instance->remove_unneeded_presenters( $presenters ) );
	}

	/**
	 * Tests that no presenters are removed when not on a product page.
	 *
	 * @covers ::remove_unneeded_presenters
	 */
	public function test_remove_unneeded_presenters_only_on_product_page() {
		$presenters = [
			Mockery::mock( 'Yoast\WP\SEO\Presenters\Open_Graph\Article_Publisher_Presenter' ),
			Mockery::mock( 'Yoast\WP\SEO\Presenters\Open_Graph\Article_Author_Presenter' ),
		];

		Functions\expect( 'is_product' )
			->once()
			->andReturn( false );

		$instance = new WPSEO_WooCommerce_Schema();

		$this->assertSame( $presenters, $instance->remove_unneeded_presenters( $presenters ) );
	}

	/**
	 * Test filtering offers with valueAddedTaxIncluded.
	 *
	 * @covers ::filter_offers
	 */
	public function test_filter_offers_with_vat() {
		$schema = new Schema_Double();

		$input = [
			'@type'       => 'Product',
			'name'        => 'Customizable responsive toolset',
			'url'         => 'https://example.com/product/customizable-responsive-toolset/',
			'description' => 'Sit debitis reprehenderit non rem natus. Corporis quidem quos et sit similique. Et ad hic exercitationem repudiandae rem laborum.\n\n\n\n\n\n\n\n\nCumque iusto cum enim ut. Et ipsum tempore dolorem ullam aspernatur autem et. Aut molestiae dolor natus. Ducimus molestias perspiciatis magni in libero deleniti ut. Rerum perspiciatis autem et maiores hic ducimus.\n\n\nAut tenetur ducimus distinctio quaerat deserunt sed. Sint ullam ut deserunt deleniti velit et. Incidunt in molestiae voluptas corrupti qui facilis quia.\n\n\n\n\n\nIste asperiores voluptas expedita id cupiditate. Sed error corrupti quibusdam dolor facere enim tenetur. Asperiores error qui commodi dolorem veritatis aspernatur.',
			'image'       => [
				'@id' => 'https://example.com/product/customizable-responsive-toolset/#primaryimage',
			],
			'sku'         => '209643',
			'offers'      => [
				[
					'@type'              => 'Offer',
					'price'              => '49.00',
					'priceSpecification' => [
						'@type'                 => 'PriceSpecification',
						'valueAddedTaxIncluded' => false,
					],
					'priceCurrency'      => 'GBP',
					'availability'       => 'https://schema.org/InStock',
					'url'                => 'https://example.com/product/customizable-responsive-toolset/',
					'seller'             => [
						'@type' => 'Organization',
						'name'  => 'WooCommerce',
						'url'   => 'https://example.com',
					],
				],
			],
		];

		$expected_output                     = $input;
		$expected_output['offers'][0]['@id'] = 'https://example.com/#/schema/offer/209643-0';
		$expected_output['offers'][0]['priceSpecification']['@type']                 = 'PriceSpecification';
		$expected_output['offers'][0]['priceSpecification']['valueAddedTaxIncluded'] = true;

		$base_url = 'http://example.com';
		Functions\stubs(
			[
				'get_site_url'             => $base_url,
				'wc_get_price_decimals'    => 2,
				'wc_tax_enabled'           => true,
				'wc_format_decimal'        => static function ( $number ) {
					return \number_format( $number, 2 );
				},
				'get_woocommerce_currency' => 'GBP',
				'wc_prices_include_tax'    => true,
			]
		);

		Functions\expect( 'get_option' )
			->with( 'woocommerce_tax_display_shop' )
			->andReturn( 'incl' );

		$product = Mockery::mock( 'WC_Product' );
		$product->expects( 'get_id' )->once()->andReturn( '209643' );
		$product->expects( 'get_price' )->once()->andReturn( 49 );
		$product->expects( 'get_min_purchase_quantity' )->once()->andReturn( 1 );
		$product->expects( 'is_on_sale' )->once()->andReturn( false );
		$product->expects( 'is_on_backorder' )->once()->andReturn( false );

		$this->meta
			->expects( 'for_current_page' )
			->once()
			->andReturn( (object) [ 'site_url' => 'https://example.com/' ] );

		$output = $schema->filter_offers( $input, $product );

		$this->assertSame( $expected_output, $output );
	}
}
