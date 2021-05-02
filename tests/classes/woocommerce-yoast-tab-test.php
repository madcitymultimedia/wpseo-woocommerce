<?php

namespace Yoast\WP\Woocommerce\Tests\Classes;

use Brain\Monkey\Functions;
use WPSEO_WooCommerce_Yoast_Tab;
use Yoast\WP\Woocommerce\Tests\Doubles\Yoast_Tab_Double;
use Yoast\WP\Woocommerce\Tests\TestCase;

/**
 * Class WooCommerce_Schema_Test.
 */
class WooCommerce_Yoast_Tab_Test extends TestCase {

	/**
	 * Test our constructor.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::__construct
	 */
	public function test_construct() {
		$instance = new WPSEO_WooCommerce_Yoast_Tab();
		$this->assertSame( 10, \has_filter( 'woocommerce_product_data_tabs', [ $instance, 'yoast_seo_tab' ] ) );
		$this->assertSame( 10, \has_action( 'woocommerce_product_data_panels', [ $instance, 'add_yoast_seo_fields' ] ) );
		$this->assertSame( 10, \has_action( 'save_post', [ $instance, 'save_data' ] ) );
	}

	/**
	 * Test adding our section to the Product Data section.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::yoast_seo_tab
	 */
	public function test_yoast_seo_tab() {
		$instance = new WPSEO_WooCommerce_Yoast_Tab();
		$expected = [
			'yoast_tab' => [
				'label'  => 'Yoast SEO',
				'class'  => 'yoast-seo',
				'target' => 'yoast_seo',
			],
		];
		$this->assertSame( $expected, $instance->yoast_seo_tab( [] ) );
	}

	/**
	 * Test loading our view.
	 *
	 * @dataProvider data_add_yoast_seo_fields
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::add_yoast_seo_fields
	 *
	 * @param string $expected_output Substring expected to be found in the actual output.
	 */
	public function test_add_yoast_seo_fields( $expected_output ) {
		if ( \defined( 'WPSEO_WOO_PLUGIN_FILE' ) === false ) {
			\define( 'WPSEO_WOO_PLUGIN_FILE', './wpseo-woocommerce.php' );
		}

		$this->stubTranslationFunctions();
		$this->stubEscapeFunctions();

		Functions\stubs(
			[
				'get_the_ID'      => 123,
				'get_post_meta'   => 'gtin8',
				'plugin_dir_path' => './',
				'wp_nonce_field'  => static function ( $action, $name ) {
					return '<input type="hidden" id="" name="' . $name . '" value="' . $action . '" />';
				},
			]
		);

		$this->expectOutputContains( $expected_output );

		$instance = new WPSEO_WooCommerce_Yoast_Tab();
		$instance->add_yoast_seo_fields();
	}

	/**
	 * Data provider for the `test_add_yoast_seo_fields()` test.
	 *
	 * @return array
	 */
	public function data_add_yoast_seo_fields() {
		return [
			[ 'yoast_seo[gtin8]' ],
			[ '<div id="yoast_seo" class="panel woocommerce_options_panel">' ],
		];
	}

	/**
	 * Test whether we don't save any data when the current save is a post revision.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::save_data
	 */
	public function test_save_data_revision() {
		Functions\stubs(
			[
				'wp_is_post_revision' => true,
			]
		);

		$instance = new WPSEO_WooCommerce_Yoast_Tab();
		$this->assertFalse( $instance->save_data( 123 ) );
	}

	/**
	 * Test whether we don't save any data when there is no valid nonce.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::save_data
	 */
	public function test_save_data_wrong_nonce() {
		Functions\stubs(
			[
				'wp_is_post_revision' => false,
				'wp_verify_nonce'     => false,
			]
		);

		$instance = new WPSEO_WooCommerce_Yoast_Tab();
		$this->assertFalse( $instance->save_data( 123 ) );
	}

	/**
	 * Test whether we don't save any data when there is nothing to save.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::save_data
	 */
	public function test_save_data_empty() {
		Functions\stubs(
			[
				'wp_is_post_revision' => false,
				'wp_verify_nonce'     => true,
				'update_post_meta'    => true,
			]
		);

		$instance = new WPSEO_WooCommerce_Yoast_Tab();

		// No $_POST data, so nothing to save.
		$this->assertTrue( $instance->save_data( 123 ) );
	}

	/**
	 * Test whether we save data when we have it.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::save_data
	 * @covers WPSEO_WooCommerce_Yoast_Tab::save_post_data
	 */
	public function test_save_data() {
		Functions\stubs(
			[
				'wp_is_post_revision' => false,
				'wp_verify_nonce'     => true,
				'update_post_meta'    => true,
			]
		);

		$instance = new WPSEO_WooCommerce_Yoast_Tab();

		$_POST = [
			'yoast_seo' => [
				'gtin8' => '1234',
			],
		];
		$this->assertTrue( $instance->save_data( 123 ) );
	}

	/**
	 * Test our data validation.
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::validate_data
	 */
	public function test_validate_data() {
		$instance = new Yoast_Tab_Double();
		$this->assertTrue( $instance->validate_data( '12345' ) );
		$this->assertFalse( $instance->validate_data( '12345<script>' ) );
		$this->assertTrue( $instance->validate_data( '' ) );
	}

	/**
	 * Test our input fields are outputted correctly.
	 *
	 * @dataProvider data_input_field_for_identifier
	 *
	 * @covers WPSEO_WooCommerce_Yoast_Tab::input_field_for_identifier
	 *
	 * @param string $expected_output Substring expected to be found in the actual output.
	 */
	public function test_input_field_for_identifier( $expected_output ) {
		$this->stubEscapeFunctions();

		$this->expectOutputContains( $expected_output );

		$instance = new Yoast_Tab_Double();
		$instance->input_field_for_identifier( 'gtin8', 'GTIN 8', '12345678' );
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
			[ 'yoast_identifier_gtin8' ],
		];
	}
}
