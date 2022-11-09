/* eslint-disable no-useless-concat */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
// Custom task
// Rem defaultChangelogEntrys: "Other:\n* Includes every change in Yoast SEO core " + "VERSIONNUMBER" + ". See the [core changelog](https://wordpress.org/plugins/wordpress-seo/#developers).\n",

module.exports = {
	"wpseo-woocommerce": {
		options: {
			readmeFile: "./README.md",
			releaseInChangelog: /[#] \d+\.\d+(\.\d+)?\n\n/g,
			matchChangelogHeader: /Changelog\n=========\n/ig,
			newHeadertemplate: "Changelog\n=========\n\n" + "## " + "VERSIONNUMBER" + "\n\nRelease date: " + "DATESTRING"  + "\n",
			matchCorrectHeader: "## " + "VERSIONNUMBER" + "(.|\\n)*?\\n(?=(\\n#### \\w\+?\\n|## \\d+[\.\\d]+\\n|### Earlier versions|$))",
			matchCorrectLines: "## " + "VERSIONNUMBER" + "(.|\\n)*?(?=(\\n## \\d+[\.\\d]+|### Earlier versions|$))",
			matchCleanedChangelog: "## " + "VERSIONNUMBER" + "(.|\\n)*### Earlier versions|$",
			replaceCleanedChangelog: "### Earlier versions",
			defaultChangelogEntries: "",
			useANewLineAfterHeader: false,
			commitChangelog: true,
			changelogToInject: ".tmp/n8nchangelog.txt",
		},
	},
};
