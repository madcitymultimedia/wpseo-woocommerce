// https://github.com/gruntjs/grunt-contrib-watch
module.exports = {
	options: {
		livereload: true,
	},
	grunt: {
		options: {
			reload: true,
		},
		files: [
			"<%= files.grunt %>",
			"<%= files.config %>",
		],
		tasks: [
			"eslint:grunt",
		],
	},
	php: {
		files: [
			"<%= files.php %>",
		],
		tasks: [
			"phplint",
			"phpcs",
			"checktextdomain",
		],
	},
	js: {
		files: [
			"<%= files.js %>",
		],
		tasks: [
			"build:js",
			"eslint:js",
		],
	},
	css: {
		files: [
			"css/*css",
		],
		tasks: [
			"build:css",
		],
	},
};