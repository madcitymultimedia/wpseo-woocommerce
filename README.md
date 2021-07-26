WooCommerce Yoast SEO
=====================
Requires at least: 5.6
Tested up to: 5.8
Stable tag: 14.3-RC1
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

### 14.3: July 27th, 2021
Bugfixes:
* Fixes a bug where the product identifier replacement variables `%%wc_gtin8%%`, `%%wc_gtin12%%`, `%%wc_gtin13%%`, `%%wc_gtin14%%`, `%%wc_isbn%%` and `%%wc_mpn%%` would not work in meta descriptions when retrieving posts using REST requests.

### 14.2.1: July 21st, 2021
Bugfixes:
* Fixes a bug where a fatal error was thrown on the frontend of product pages when using the `%%wc_shortdesc%%` snippet variable while running PHP 8.0.
* Fixes a bug where the `%%wc_price%%`, `%%wc_sku%%`, `%%wc_shortdesc%%` and `%%wc_brand%%` snippet variable values were not displayed on the frontend.

### 14.2: July 13th, 2021
Enhancements:
* Adds key/value pairs of all WooCommerce SEO meta tags to our REST API.

Other:
* Sets the minimum WordPress version to 5.6.
* Sets the minimum required Yoast SEO to 16.7.
* Replaces an occurrence of the deprecated jQuery `.ready` syntax with more modern syntax. Props to [kkmuffme](https://github.com/kkmuffme).

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
