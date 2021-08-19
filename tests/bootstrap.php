<?php
/**
 * PHPUnit bootstrap file
 *
 * @package WPSEO\WooCommerce\Tests
 */

define( 'WPSEO_INDEXABLES', true );

if ( file_exists( dirname( __DIR__ ) . '/vendor/autoload.php' ) === false ) {
	echo PHP_EOL, 'ERROR: Run `composer install` to generate the autoload files before running the unit tests.', PHP_EOL;
	exit( 1 );
}

require_once __DIR__ . '/../vendor/yoast/wp-test-utils/src/BrainMonkey/bootstrap.php';
require_once __DIR__ . '/../vendor/autoload.php';
