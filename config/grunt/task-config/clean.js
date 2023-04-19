module.exports = {
	jsDistFiles: [ "js/dist/*.js" ],
	artifact: [
		"artifact",
	],
	"po-files": [
		"languages/*.po",
		"<%= files.pot.yoastWooSeoJs %>",
		"<%= files.pot.gettext %>",
		"languages/<%= pkg.plugin.textdomain %>-temp.pot",
	],
};
