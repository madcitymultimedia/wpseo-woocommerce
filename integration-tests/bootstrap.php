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

$GLOBALS['wp_tests_options'] = [
	'active_plugins' => [ 'wpseo-woocommerce/wpseo-woocommerce.php', 'wordpress-seo/wp-seo.php' ],
];

require_once dirname( __DIR__ ) . '/vendor/yoast/wp-test-utils/src/WPIntegration/bootstrap-functions.php';

/*
 * Load WordPress, which will load the Composer autoload file, and load the MockObject autoloader after that.
 */
WPIntegration\bootstrap_it();

if ( ! defined( 'WP_PLUGIN_DIR' ) || file_exists( WP_PLUGIN_DIR . '/wpseo-woocommerce/wpseo-woocommerce.php' ) === false ) {
	echo PHP_EOL, 'ERROR: Please check whether the WP_PLUGIN_DIR environment variable is set and set to the correct value. The unit test suite won\'t be able to run without it.', PHP_EOL;
	exit( 1 );
}
