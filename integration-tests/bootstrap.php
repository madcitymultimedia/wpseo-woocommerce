<?php
/**
 * WooCommerce Yoast SEO plugin test file.
 *
 * @package WPSEO/WooCommerce/Tests
 */

use Yoast\WPTestUtils\WPIntegration;

// Disable Xdebug backtrace.
if ( function_exists( 'xdebug_disable' ) ) {
	xdebug_disable();
}

echo 'Welcome to the WordPress SEO WooCommerce test suite' . PHP_EOL;
echo 'Version: 1.0' . PHP_EOL . PHP_EOL;

if ( getenv( 'WP_PLUGIN_DIR' ) !== false ) {
	define( 'WP_PLUGIN_DIR', getenv( 'WP_PLUGIN_DIR' ) );
}
else {
	define( 'WP_PLUGIN_DIR', dirname( dirname( __DIR__ ) ) );
}

require_once dirname( __DIR__ ) . '/vendor/yoast/wp-test-utils/src/WPIntegration/bootstrap-functions.php';

// Determine the WP_TEST_DIR.
$_tests_dir = WPIntegration\get_path_to_wp_test_dir();

// Give access to tests_add_filter() function.
require_once rtrim( $_tests_dir, '/' ) . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
$yoast_woocommerce_load_plugins = static function () {
	require_once WP_PLUGIN_DIR . '/wordpress-seo/wp-seo.php';
	require_once dirname( __DIR__ ) . '/wpseo-woocommerce.php';
};

/**
 * Filter the plugins URL to pretend the plugin is installed in the test environment.
 *
 * @param string $url    The complete URL to the plugins directory including scheme and path.
 * @param string $path   Path relative to the URL to the plugins directory. Blank string
 *                       if no path is specified.
 * @param string $plugin The plugin file path to be relative to. Blank string if no plugin
 *                       is specified.
 *
 * @return string
 */
$yoast_woocommerce_filter_plugin_path = static function ( $url, $path, $plugin ) {
	$plugin_dir = dirname( __DIR__ );
	if ( $plugin === $plugin_dir . '/wpseo-woocommerce.php' ) {
		$url = str_replace( dirname( $plugin_dir ), '', $url );
	}

	return $url;
};

// Add plugin to active mu-plugins - to make sure it gets loaded.
tests_add_filter( 'muplugins_loaded', $yoast_woocommerce_load_plugins );

// Overwrite the plugin URL to not include the full path.
tests_add_filter( 'plugins_url', $yoast_woocommerce_filter_plugin_path, 10, 3 );

/*
 * Load WordPress, which will load the Composer autoload file, and load the MockObject autoloader after that.
 */
WPIntegration\bootstrap_it();
