WooCommerce Yoast SEO
=====================
Requires at least: 5.9
Tested up to: 6.0
Stable tag: 15.2-RC6
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

### 15.2: September 6th, 2022



Enhancements:

* Adds a new assessment which checks whether products (or product variants) have an identifier.
* Adds a new assessment which checks whether products (or product variants) have a SKU.
* Adds support for the ASIN values and adds these to Product/Offer schema nodes

Bugfixes:

* Fixes two prices being shown in the Slack integration metadata when a product is on sale.

Other:

* Sets the minimum required version of Yoast SEO to 19.6.
* Sets the minimum supported WordPress version to 5.9.

### 15.1: August 9th, 2022

Other:

* Makes Yoast WooCommerce SEO compatible with the new analysis edit buttons in Yoast SEO Premium.
* Sets the minimum supported WordPress version to 5.9.
* Sets the minimum supported Yoast SEO version to 19.5.


### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
