WooCommerce Yoast SEO
=====================
Requires at least: 5.9
Tested up to: 6.1
Stable tag: 15.4-RC1
Requires PHP: 5.6.20
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

## 15.4

Release date: December 13th, 2022

#### Enhancements

* Removes a box in the WooCommerce SEO page that prompts users to help with translating the plugin in their site language.

#### Other

* Removes the beta badge from the _word complexity_ assessment.
* Sets the minimum required Yoast SEO version to 19.12.

## 15.3

Release date: November 8th, 2022

#### Enhancements

Adds a `material` property to product pages’ schema.

#### Bugfixes

Fixes a bug where the Product description assessment would also appear under the Readability analysis tab when the Cornerstone content toggle would be switched on.

#### Other

* Bumps the Yoast SEO minimum required version to 19.10.
* Ensures compatibility with the High Performance Order Storage feature in WooCommerce 7.1+.
* Sets the WordPress “tested up to” version to 6.1.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
