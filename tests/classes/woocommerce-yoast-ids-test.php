<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use WP_Post;
use Mockery;
use Brain\Monkey\Functions;
use WPSEO_WooCommerce_Yoast_Ids;

use Yoast\WP\Woocommerce\Tests\Doubles\Yoast_Ids_Double;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 */
class WooCommerce_Yoast_Ids_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Testing environment setup
	 */
	public function set_up() {
		parent::set_up();
		$this->instance = new Yoast_Ids_Double();
	}

	/**
	 * Test our constructor.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Ids::__construct
	 */
	public function test_construct() {
		$this->assertSame( 10, \has_action( 'woocommerce_product_after_variable_attributes', [ $this->instance, 'add_variations_global_ids' ] ) );
		$this->assertSame( 10, \has_action( 'woocommerce_save_product_variation', [ $this->instance, 'save_data' ] ) );
	}

	/**
	 * Test the function saving data.
	 *
	 * @dataProvider data_save_data
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Ids::save_data
	 *
	 * @param bool  $verify_nonce           Wether the nonce is verified or not.
	 * @param int   $wp_verify_nonce_times  Number of times wp_verify_nonce() is expected to be called.
	 * @param bool  $update_post            Wether the post is successfully updated or not.
	 * @param int   $update_post_meta_times Number of times update_post_meta_times() is expected to be called.
	 * @param array $post                   The content of $_POST global variable.
	 * @param bool  $expected               The expected result.
	 */
	public function test_save_data( $verify_nonce, $wp_verify_nonce_times, $update_post, $update_post_meta_times, $post, $expected ) {

		Functions\expect( 'wp_verify_nonce' )
			->times( $wp_verify_nonce_times )
			->andReturn( $verify_nonce );

		Functions\expect( 'update_post_meta' )
			->times( $update_post_meta_times )
			->andReturn( $update_post );

		$_POST = $post;
		$this->assertEquals( $expected, $this->instance->save_data( 1337 ) );
	}

	/**
	 * Data provider for the `test_save_data()` test.
	 *
	 * @return array
	 */
	public function data_save_data() {
		return [
			'all_ok' => [
				true,
				1,
				true,
				1,
				[
					'_wpnonce_yoast_seo_woo_gids' => '1234',
				],
				true,
			],
			[
				false,
				1,
				true,
				0,
				[
					'_wpnonce_yoast_seo_woo_gids' => '1234',
					'yoast_seo_variation'         => [
						'gtin8' => '1234',
					],
				],
				false,
			],
			[
				false,
				1,
				false,
				0,
				[
					'_wpnonce_yoast_seo_woo_gids' => '1234',
					'yoast_seo_variation'         => [
						'gtin8' => '1234',
					],
				],
				false,
			],
			[
				false,
				0,
				false,
				0,
				[
					'yoast_seo_variation' => [],
				],
				false,
			],
		];
	}

	/**
	 * Test that input fields are created correctly.
	 *
	 * @dataProvider data_input_field_for_identifier
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Ids::input_field_for_identifier
	 *
	 * @param string $expected Substring expected to be found in the actual output.
	 */
	public function test_input_field_for_identifier( $expected ) {
		$this->stubEscapeFunctions();

		$this->expectOutputContains( $expected );

		$this->instance->input_field_for_identifier( 123, 'gtin8', 'GTIN 8', '12345678', true );
	}

	/**
	 * Data provider for the `test_input_field_for_identifier()` test.
	 *
	 * @return array
	 */
	public function data_input_field_for_identifier() {
		return [
			[ 'gtin8' ],
			[ 'GTIN 8' ],
			[ '12345678' ],
			[ 'yoast_variation_identfier[123][gtin8]' ],
		];
	}

	/**
	 * Test adding the variation global identifiers fields to the product form.
	 *
	 * @dataProvider data_add_variations_global_ids
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Ids::add_variations_global_ids
	 *
	 * @param int      $post_id        The id of the variation's parent post.
	 * @param int      $variation_id   The id of the variation.
	 * @param string[] $post_gids      The array of variation's parent post global identifiers.
	 * @param string[] $expected       The array of expected results.
	 */
	public function test_add_variations_global_ids( $post_id, $variation_id, $post_gids, $expected ) {
		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		$mock_variation              = Mockery::mock( '\WP_Post' )->makePartial();
		$mock_variation->post_parent = $post_id;
		$mock_variation->ID          = $variation_id;

		Functions\expect( 'get_post_meta' )
			->once()
			->with( $mock_variation->ID, 'wpseo_variation_global_identifiers_values', true )
			->andReturn( $post_gids );

		Functions\expect( 'wp_nonce_field' )
			->once()
			->with( 'yoast_woo_seo_variation_identifiers', '_wpnonce_yoast_seo_woo_gids' )
			->andReturn( 'nonce' );

		$this->expectOutputContains( $expected );
		$this->instance->add_variations_global_ids( null, null, $mock_variation );
	}

	/**
	 * Data provider for the `add_variations_global_ids()` test.
	 *
	 * @return array
	 */
	public function data_add_variations_global_ids() {
		return [
			[
				1337,
				1,
				[
					'gtin8'   => '1',
					'gtin12'  => '2',
					'gtin13'  => '3',
					'gtin14'  => '4',
					'mpn'     => '12',
				],
				'id="yoast_variation_identfier[1][gtin12]" name="yoast_seo_variation[1][gtin12]" value="2"',
			],
			[
				1337,
				2,
				[
					'gtin8'   => '1',
					'gtin12'  => '2',
					'gtin13'  => '3',
					'gtin14'  => '4',
					'mpn'     => '12',
				],
				'id="yoast_variation_identfier[2][mpn]" name="yoast_seo_variation[2][mpn]" value="12"',
			],
		];
	}
}
