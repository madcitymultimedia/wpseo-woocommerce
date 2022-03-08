WooCommerce Yoast SEO
=====================
Requires at least: 5.8
Tested up to: 5.9
Stable tag: 14.6
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

### 14.7: March 22nd, 2022
Enhancements:
* Improve the Schema on checkout pages by removing the default `ReadAction` we used to add there.
* Improve the Schema on product pages by replacing the default `ReadAction` with a `BuyAction`. 
* Adds a new filter `wpseo_schema_offer` filter that can be used to change the output of the offers attribute of the product schema. Props to [Dekadinious](https://github.com/Dekadinious).

Other:
* Sets the minimum required Yoast SEO version to 18.4.
* Sets minimum required WordPress version to 5.8.


### 14.6: January 25th, 2022
Enhancements:
* Adapts the Product description assessment for Japanese to use a character-based count, with a recommended length of 40-100 characters.

Bugfixes:
* Fixes a bug where an empty product identifier value could be output.

Other:
* Sets the minimum required Yoast SEO version to 18.0.
* Sets the WordPress tested up to version to 5.9.
* Sets the WooCommerce tested up to version to 6.1.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
