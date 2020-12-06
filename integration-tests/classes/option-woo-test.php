<?php
/**
 * WooCommerce Yoast SEO plugin test file.
 *
 * @package WPSEO/WooCommerce/Tests
 */

/**
 * Unit tests.
 */
class WPSEO_Option_Woo_Test extends WPSEO_WooCommerce_UnitTestCase {

	/**
	 * Gets the data from the data provider.
	 *
	 * @dataProvider validate_option_values
	 *
	 * @covers WPSEO_Option_Woo::validate_option
	 *
	 * @param string           $field_name The field name to validate.
	 * @param string|bool      $expected   The expected value.
	 * @param string|bool|null $dirty      The value for the dirty argument.
	 * @param string|bool      $clean      The value for the clean argument.
	 * @param string|bool|null $old        The value for the old argument.
	 * @param string           $short      Determines whether the short form should set or not.
	 */
	public function test_validate_option( $field_name, $expected, $dirty, $clean, $old, $short = 'off' ) {
		$option = new WPSEO_Option_Woo_Double();

		$dirty = ( $dirty !== null ) ? [ $field_name => $dirty ] : [];
		$old   = ( $old !== null ) ? [ $field_name => $old ] : [];

		$result = $option->validate_option(
			array_merge( [ 'short_form' => $short ], $dirty ),
			[ $field_name => $clean ],
			$old
		);

		$this->assertSame( [ $field_name => $expected ], $result );
	}

	/**
	 * Provider for the test_validate_option.
	 *
	 * Formatting of each record that is provided:
	 * field, expected, dirty, clean, old and short-form.
	 *
	 * @return array[]
	 */
	public function validate_option_values() {
		return [
			// Tests a non defined value.
			[ 'test', null, 123, null, null ],

			// Tests the validation of the dbversion option.
			[ 'woo_dbversion', 4, 1, 4, '' ],

			// Tests the validation of the fields where the dirty value exists in the validate data types.
			[ 'woo_schema_brand', 'yoast', 'yoast', 'yoast', null ],
			[ 'woo_schema_manufacturer', 'yoast', 'yoast', 'yoast', null ],
			[ 'woo_schema_color', 'yoast', 'yoast', 'yoast', null ],
			[ 'woo_breadcrumbs', true, true, true, '' ],
			[ 'woo_metabox_top', true, true, true, '' ],

			// Validation where the dirty value is not in the validate data types.
			[ 'woo_schema_brand', 'bar', 'bar', 'yoast', null ],
			[ 'woo_schema_manufacturer', 'bar', 'bar', 'yoast', null ],
			[ 'woo_schema_color', 'bar', 'bar', 'yoast', null ],
			[ 'woo_breadcrumbs', false, null, true, '' ],
			[ 'woo_metabox_top', false, null, true, '' ],

			// Validation where the old value is in the validate data types with short form enabled.
			[ 'woo_schema_brand', 'yoast', null, 'yoast', 'yoast,', 'on' ],
			[ 'woo_schema_manufacturer', 'yoast', null, 'yoast', 'yoast', 'on' ],
			[ 'woo_schema_color', 'yoast', null, 'yoast', 'yoast', 'on' ],

			// Validation where the old value isn't in the validate data types with short form enabled.
			[ 'woo_schema_brand', 'bar', null, 'yoast', 'bar', 'on' ],
			[ 'woo_schema_manufacturer', 'bar', null, 'yoast', 'bar', 'on' ],
			[ 'woo_schema_color', 'bar', null, 'yoast', 'bar', 'on' ],

			// Validation where the old value isn't in the validate data types with short form not enabled.
			[ 'woo_schema_brand', 'yoast', null, 'yoast', 'bar', 'off' ],
			[ 'woo_schema_manufacturer', 'yoast', null, 'yoast', 'bar', 'off' ],
			[ 'woo_schema_color', 'yoast', null, 'yoast', 'bar', 'off' ],

			// Validation where the boolean old value is set with short form enabled.
			[ 'woo_breadcrumbs', true, null, true, true, 'on' ],
			[ 'woo_metabox_top', true, null, true, true, 'on' ],

			// Validation where the boolean old value is not set with short form enabled.
			[ 'woo_breadcrumbs', false, null, true, null, 'on' ],
			[ 'woo_metabox_top', false, null, true, null, 'on' ],

			// Validation where the boolean old value is not set with short form not enabled.
			[ 'woo_breadcrumbs', false, null, true, true, 'off' ],
			[ 'woo_metabox_top', false, null, true, true, 'off' ],
		];
	}
}
