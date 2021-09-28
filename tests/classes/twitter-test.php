<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey;
use Mockery;
use WPSEO_WooCommerce_Twitter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Twitter_Test
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Twitter
 */
class Twitter_Test extends TestCase {

	/**
	 * The Twitter class under test.
	 *
	 * @var WPSEO_WooCommerce_Twitter
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_WooCommerce_Twitter();
	}

	/**
	 * Tests that the right hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'wpseo_twitter_image' );
		$this->instance->register_hooks();
	}

	/**
	 * Tests that the twitter image correctly falls back to the first
	 * product gallery image.
	 *
	 * @covers ::fallback_to_product_gallery_image
	 */
	public function test_fallback_to_product_gallery_image() {
		// Empty image, so should provide a fallback.
		$empty_image_url    = '';
		$fallback_image_url = 'http://basic.wordpress.test/wp-content/uploads/2020/04/teddy_2.jpg';
		$context            = (object) [
			'open_graph_enabled' => false,
		];
		$model              = (object) [
			'object_id'       => 13,
			'object_type'     => 'post',
			'object_sub_type' => 'product',
		];
		$product            = Mockery::mock( 'WC_Product' )->makePartial();
		$product
			->expects( 'get_gallery_image_ids' )
			->andReturn( [ 21, 23, 24 ] );

		$presentation = $this->mock_presentation( $context, $model );

		Monkey\Functions\expect( 'wc_get_product' )
			->with( $model->object_id )
			->andReturn( $product );

		$this->mock_yoastseo( 21, $fallback_image_url );

		$image_url = $this->instance->fallback_to_product_gallery_image( $empty_image_url, $presentation );

		$this->assertSame( $fallback_image_url, $image_url );
	}

	/**
	 * Tests that the twitter image does not fall back to the first
	 * product gallery image when open graph is enabled.
	 *
	 * @covers ::fallback_to_product_gallery_image
	 */
	public function test_does_not_fallback_to_product_gallery_image_when_opengraph_is_enabled() {
		// Empty image, so should provide a fallback.
		$empty_image_url = '';
		$context         = (object) [
			'open_graph_enabled' => true,
		];
		$model           = (object) [];

		$presentation = $this->mock_presentation( $context, $model );

		$image_url = $this->instance->fallback_to_product_gallery_image( $empty_image_url, $presentation );

		$this->assertSame( '', $image_url );
	}

	/**
	 * Tests that the twitter image does not fall back to an image
	 * when no product gallery images exist.
	 *
	 * @covers ::fallback_to_product_gallery_image
	 */
	public function test_does_not_fallback_when_product_gallery_image_is_empty() {
		// Empty image, so should provide a fallback.
		$empty_image_url    = '';
		$fallback_image_url = '';
		$context            = (object) [
			'open_graph_enabled' => false,
		];
		$model              = (object) [
			'object_id'       => 13,
			'object_type'     => 'post',
			'object_sub_type' => 'product',
		];
		$product            = Mockery::mock( 'WC_Product' )->makePartial();
		$product
			->expects( 'get_gallery_image_ids' )
			->andReturn( [] );

		$presentation = $this->mock_presentation( $context, $model );

		Monkey\Functions\expect( 'wc_get_product' )
			->with( $model->object_id )
			->andReturn( $product );

		$image_url = $this->instance->fallback_to_product_gallery_image( $empty_image_url, $presentation );

		$this->assertSame( $fallback_image_url, $image_url );
	}

	/**
	 * Mocks the Indexable presentation.
	 *
	 * @param object $context The meta context.
	 * @param object $model   The model.
	 *
	 * @return Mockery\MockInterface The mock presentation
	 */
	private function mock_presentation( $context, $model ) {
		$presentation = Mockery::mock();

		$presentation->context = $context;
		$presentation->model   = $model;

		return $presentation;
	}

	/**
	 * Mocks the YoastSEO function for the Twitter image tests.
	 *
	 * @param int    $fallback_image_id  The image ID of the fallback image.
	 * @param string $fallback_image_url The image URL of the fallback image.
	 */
	private function mock_yoastseo( $fallback_image_id, $fallback_image_url ) {
		$twitter_image_helper = Mockery::mock()->makePartial();
		$twitter_image_helper
			->expects( 'get_by_id' )
			->with( $fallback_image_id )
			->andReturn( $fallback_image_url );

		$surfaces = (object) [
			'helpers' => (object) [
				'twitter' => (object) [
					'image' => $twitter_image_helper,
				],
			],
		];

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( $surfaces );
	}
}
