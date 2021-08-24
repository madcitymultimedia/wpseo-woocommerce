WooCommerce Yoast SEO
=====================
Requires at least: 5.6
Tested up to: 5.8
Stable tag: 14.4-RC1
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

### 14.4: September 7th, 2021
Enhancements:
* Adds two new assessments (i.e., Image alt tags assessment and List presence assessment) and removes assessments that are less relevant to product pages (i.e., Outbound links assessment and Internal links assessments).
* Changes the parameters of some SEO and Readability assessments, e.g., Paragraph length assessment, Text length assessment, and Images assessment where videos are also included in the analysis etc.

### 14.3: July 27th, 2021
Bugfixes:
* Fixes a bug where the product identifier replacement variables `%%wc_gtin8%%`, `%%wc_gtin12%%`, `%%wc_gtin13%%`, `%%wc_gtin14%%`, `%%wc_isbn%%` and `%%wc_mpn%%` would not work in meta descriptions when retrieving posts using REST requests.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
