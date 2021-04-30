<?php

namespace Yoast\WP\Woocommerce\Tests\Classes\Presenters;

use Mockery;
use WPSEO_WooCommerce_Schema_Presenter;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class Schema_Presenter_Test
 *
 * @package Yoast\WP\Woocommerce\Tests\Classes\Presenters
 *
 * @coversDefaultClass WPSEO_WooCommerce_Schema_Presenter
 */
class Schema_Presenter_Test extends TestCase {

	/**
	 * The schema presenter under test.
	 *
	 * @var WPSEO_WooCommerce_Schema_Presenter
	 */
	protected $instance;

	/**
	 * The (CSS) classes to use in the tests.
	 *
	 * @var string[]
	 */
	protected $classes;

	/**
	 * The schema graph to use in the tests.
	 *
	 * @var array
	 */
	protected $graph;

	/**
	 * Sets up the tests.
	 */
	public function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		Mockery::mock( 'overload:Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter' );

		$this->graph = [
			[
				'@type' => 'Product',
				'@id'   => 'http://basic.wordpress.test/product/hippopotamus/#product',
				'name'  => 'Hippopotamus',
			],
		];

		$this->classes = [
			'yoast-schema-graph',
			'yoast-schema-graph--woo',
			'yoast-schema-graph--footer',
		];

		$this->instance = new WPSEO_WooCommerce_Schema_Presenter( $this->graph, $this->classes );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		self::assertSame( $this->graph, self::getPropertyValue( $this->instance, 'graph' ) );
		self::assertSame( $this->classes, self::getPropertyValue( $this->instance, 'classes' ) );
	}

	/**
	 * Tests the `present` method.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present() {
		$utils = Mockery::mock( 'alias:WPSEO_Utils' );
		$utils->expects( 'format_json_encode' )
			->andReturnUsing(
				static function( $data ) {
					// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_json_encode -- Can't use it, since we are mocking it here.
					return \json_encode( $data );
				}
			);

		$output = $this->instance->present();

		self::assertSame(
			'<script type="application/ld+json" class="yoast-schema-graph yoast-schema-graph--woo yoast-schema-graph--footer">{"@context":"https:\/\/schema.org","@graph":[{"@type":"Product","@id":"http:\/\/basic.wordpress.test\/product\/hippopotamus\/#product","name":"Hippopotamus"}]}</script>' . \PHP_EOL,
			$output
		);
	}

	/**
	 * Tests the `__toString` method.
	 *
	 * @covers ::__toString
	 */
	public function test_to_string() {
		$utils = Mockery::mock( 'alias:WPSEO_Utils' );
		$utils->expects( 'format_json_encode' )
			->andReturnUsing(
				static function( $data ) {
					// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_json_encode -- Can't use it, since we are mocking it here.
					return \json_encode( $data );
				}
			);

		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- We need to test if the correct HTML is output.
		echo $this->instance;
		$this->expectOutputContains(
			'<script type="application/ld+json" class="yoast-schema-graph yoast-schema-graph--woo yoast-schema-graph--footer">{"@context":"https:\/\/schema.org","@graph":[{"@type":"Product","@id":"http:\/\/basic.wordpress.test\/product\/hippopotamus\/#product","name":"Hippopotamus"}]}</script>' . \PHP_EOL
		);
	}
}



