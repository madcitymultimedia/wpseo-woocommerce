WooCommerce Yoast SEO
=====================
Requires at least: 5.6
Tested up to: 5.8
Stable tag: 14.5-RC2
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

### 14.5: December 14th, 2021
Other:
* Ensure compatibility with Yoast SEO Free 17.8.
* Sets the minimum required Yoast SEO version to 17.8.

### 14.4: September 7th, 2021
Enhancements:
* Adds the following improvements to the SEO analysis on product pages:
  * Adds the Image alt tags assessment, which checks if all images have alt tags. 
  * Removes the Outbound links assessment and Internal links assessment, as they are less relevant on product pages.
  * Sets the recommended minimum of the Keyphrase length assessment to 4 words.
  * Sets the recommended minimum of the Text length assessment to 200 words.
  * The SEO title width assessment no longer penalizes short titles.
  * Adds a criterion for orange bullet in the Images assessments on product pages.
  * Sets the recommended number of images to 4 in the Images assessments on product pages.
* Adds the following improvements to the readability analysis on product pages:
  * Adds the List presence assessment which recommends using lists on product pages.
  * Makes the Subheading distribution assessment appear only when the text contains more than 300 words.
  * Sets the recommended maximum length of the Paragraph length assessment to 70 words.
  * Sets the recommended maximum percentage of long sentences in the Sentence length assessment to 20%. Language-specific percentages can override this default value.

Other:
* Sets the minimum required Yoast SEO version to 17.1.

### Earlier versions
For the changelog of earlier versions, please refer to [the changelog on yoast.com](https://yoa.st/woo-seo-changelog).
