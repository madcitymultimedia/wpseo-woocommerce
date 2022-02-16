# Overview of the scoring system of the WooCommerce SEO specific assessments
## 1) Product description assessment
**What it does**: Checks the length of the product short description on woocommerce product pages.

**When applies**: Always on a product page.

**Name in code**: ProductDescriptionAssessment (in wpseo-woocommerce repo)

| Bullet	| Score	| Criterion	| Feedback |
|------------	|------------------	|---------------------	|---------------	|
| Red	 | 1	| Product descriptioni length = 0 words	| You should write a short description for this product. |
| Orange | 5	| Product description length < 20 words	| The short description for this product is too short. |
| Green	 | 9	| Product description lenght ≥20 words, ≤50 words	| Your short description has a good length. |
| Orange | 5	| Product description lenght > 50 words	| The short description for this product is too long. |
