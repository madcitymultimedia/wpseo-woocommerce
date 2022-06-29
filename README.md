WooCommerce Yoast SEO
=====================
Requires at least: 5.8
Tested up to: 6.0
Stable tag: 15.0-RC2
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

### 15.0: July 12th, 2022


Enhancements:

* Improves the readability analysis for English by adding a word complexity assessment for Product pages.
* Updates the Schema manipulation to follow the new best-practice for the `@id` of the `WebPage` piece introduced by Yoast SEO 19.3.

Other:

* Edits typo in id name for product variants identifiers.
* Sets the minimum required Yoast SEO version to 19.3.

### 14.9: June 14th, 2022

Enhancements:

* Adds a feature allowing users to add global identifiers (e.g., GTIN12, ISBN, etc.) to Product variations.
* Adds a feature to include global identifiers of Product variations to a Product's Schema.
* Adds variations' SKU and URL to a Product's Schema. Props to @jaredforth.
* Removes the `datePublished` and `dateModified` attributes on the `ItemPage` Schema markup for a Product.

Other:

* Sets tested up WordPress version to 6.0.
* Sets the minimum required Yoast SEO version to 19.1.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
