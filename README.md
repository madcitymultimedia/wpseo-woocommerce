WooCommerce Yoast SEO
=====================
Requires at least: 5.8
Tested up to: 5.9
Stable tag: 14.8
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

### 14.8: May 6th, 2022

Enhancements:

* Removes XML sitemap image properties `title` and `caption` following deprecation by Google.

Other:

* Sets the minimum required Yoast SEO version to 18.8.


### 14.7: April 19th, 2022
Enhancements:
* Improves the Schema on checkout pages by removing the default `ReadAction` we used to add there.
* Improves the Schema on product pages by replacing the default `ReadAction` with a `BuyAction`. 

Other:
* Sets the minimal required version for Yoast SEO to 18.6.
* Sets the minimum required WordPress version to 5.8.
* Adds a new `wpseo_schema_offer` filter that can be used to change the output of the offers attribute of the product schema. Props to [Dekadinious](https://github.com/Dekadinious).

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
