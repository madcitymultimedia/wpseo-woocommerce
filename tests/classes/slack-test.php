<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey;
use Mockery;
use WPSEO_WooCommerce_Slack;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Slack_Test
 *
 * @coversDefaultClass \WPSEO_WooCommerce_Slack
 */
class Slack_Test extends TestCase {

	/**
	 * The Slack class under test.
	 *
	 * @var WPSEO_WooCommerce_Slack
	 */
	private $instance;

	/**
	 * Sets up the tests.
	 */
	public function set_up() {
		parent::set_up();

		$this->instance = new WPSEO_WooCommerce_Slack();
	}

	/**
	 * Tests that the right hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		Monkey\Filters\expectAdded( 'wpseo_enhanced_slack_data' );
		$this->instance->register_hooks();
	}

	/**
	 * Tests that the enhanced data is correctly filtered when product is in stock.
	 *
	 * @covers ::filter_enhanced_data
	 */
	public function test_filter_enhanced_data_stock() {
		$data = [
			'Written by'        => 'Agatha Christie',
			'Est. reading time' => '15 minutes',
		];

		$model   = (object) [
			'object_id'       => 13,
			'object_type'     => 'post',
			'object_sub_type' => 'product',
		];
		$product = Mockery::mock( 'WC_Product' )->makePartial();
		$price   = '&euro;25.00';

		$product
			->expects( 'get_price_html' )
			->andReturn( $price );

		$product
			->expects( 'is_in_stock' )
			->andReturn( true );

		$product
			->expects( 'is_on_backorder' )
			->andReturn( false );

		$presentation = $this->mock_presentation( $model );

		$this->stubTranslationFunctions();

		Monkey\Functions\expect( 'wc_get_product' )
			->with( $model->object_id )
			->andReturn( $product );
		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->with( $price )
			->andReturn( $price );

		$this->assertSame(
			[
				'Price'        => '&euro;25.00',
				'Availability' => 'In stock',
			],
			$this->instance->filter_enhanced_data( $data, $presentation )
		);
	}

	/**
	 * Tests that the enhanced data is correctly filtered when product is in backorder.
	 *
	 * @covers ::filter_enhanced_data
	 */
	public function test_filter_enhanced_data_backorder() {
		$data = [
			'Written by'        => 'Agatha Christie',
			'Est. reading time' => '15 minutes',
		];

		$model   = (object) [
			'object_id'       => 13,
			'object_type'     => 'post',
			'object_sub_type' => 'product',
		];
		$product = Mockery::mock( 'WC_Product' )->makePartial();
		$price   = '&euro;25.00';

		$product
			->expects( 'get_price_html' )
			->andReturn( $price );

		$product
			->expects( 'is_in_stock' )
			->andReturn( true );

		$product
			->expects( 'is_on_backorder' )
			->andReturn( true );

		$presentation = $this->mock_presentation( $model );

		$this->stubTranslationFunctions();

		Monkey\Functions\expect( 'wc_get_product' )
			->with( $model->object_id )
			->andReturn( $product );
		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->with( $price )
			->andReturn( $price );

		$this->assertSame(
			[
				'Price'        => '&euro;25.00',
				'Availability' => 'On backorder',
			],
			$this->instance->filter_enhanced_data( $data, $presentation )
		);
	}

	/**
	 * Mocks the Indexable presentation.
	 *
	 * @param object $model The model.
	 *
	 * @return Mockery\MockInterface The mock presentation.
	 */
	private function mock_presentation( $model ) {
		$presentation = Mockery::mock();

		$presentation->model = $model;

		return $presentation;
	}
}
