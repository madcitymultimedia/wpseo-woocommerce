module.exports = {
	artifact: {
		files: [
			{
				expand: true,
				cwd: ".",
				src: [
					// Folders to copy
					"classes/**",
					"languages/**",
					"vendor/**",
					"!vendor/bin",
					"js/dist/*.js",
					"!js/dist/*.nomin.js",
					// Files to copy
					"*.php",
				],
				dest: "artifact",
			},
		],
	},

	"makepot-yoast-woo-seo": {
		src: "<%= files.pot.gettext %>",
		dest: "<%= files.pot.yoastWooSeoJs %>",
	},
};
