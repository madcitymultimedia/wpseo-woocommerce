[![Coverage Status](https://coveralls.io/repos/github/Yoast/wpseo-woocommerce/badge.svg?branch=trunk)](https://coveralls.io/github/Yoast/wpseo-woocommerce?branch=trunk)

WooCommerce Yoast SEO
=====================
Requires at least: 6.1
Tested up to: 6.2
Stable tag: 20.11-RC1
Requires PHP: 7.2.5
Depends: Yoast SEO, WooCommerce

Description
-----------

This extension to WooCommerce and Yoast SEO makes sure there's perfect communication between the two plugins.

This repository uses [the Yoast grunt tasks plugin](https://github.com/Yoast/plugin-grunt-tasks).

Installation
------------

1. Go to Plugins -> Add New.
2. Click "Upload" right underneath "Install Plugins".
3. Upload the zip file that this readme was contained in.
4. Activate the plugin.
5. Go to SEO -> Licenses and enter your WooCommerce SEO license key.
6. Save settings, your license key will be validated. If all is well, you should now see the WooCommerce SEO settings.

Frequently Asked Questions
--------------------------

You can find the FAQ [online here](https://kb.yoast.com/kb/category/woocommerce-seo/).

Changelog
=========

## 20.11

Release date: 2023-07-11

#### Bugfixes

* Fixes a bug where the Yoast SEO metabox would not load when the short description metabox had been deactivated.

#### Other

* Bumps the minimum required Yoast SEO version to 20.6.
* Sets the minimum supported WooCommerce version to 7.1.
* Sets the minimum supported WordPress version to 6.1.

## 15.7

Release date: 2023-04-26

#### Enhancements

* Makes the _SKU_ and _product identifiers_ assessments available for grouped products.

#### Bugfixes

* Fixes a bug where new translations would not be translated.

#### Other

* Bumps the minimum required version of Yoast SEO to 20.6.
* Drops compatibility with PHP 5.6, 7.0 and 7.1.
* Sets the WordPress tested up to version to 6.2.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
