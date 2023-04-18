/* global require, process */
const { flattenVersionForFile } = require( "./config/grunt/lib/version.js" );
const timeGrunt = require( "time-grunt" );
const loadGruntConfig = require( "load-grunt-config" );
const path = require( "path" );
require( "dotenv" ).config();

module.exports = function( grunt ) {
	timeGrunt( grunt );

	const pkg = grunt.file.readJSON( "package.json" );
	const pluginVersion = pkg.yoast.pluginVersion;

	// Define project configuration
	const project = {
		pluginVersion: pluginVersion,
		pluginSlug: "wpseo-woocommerce",
		pluginMainFile: "wpseo-woocommerce.php",
		pluginVersionConstant: "WPSEO_WOO_VERSION",
		paths: {
			/**
			 * Gets the config path.
			 *
			 * @returns {string} Config path.
			 */
			get config() {
				return this.grunt + "task-config/";
			},
			grunt: "config/grunt/",
			languages: "languages/",
			logs: "logs/",
		},
		files: {
			/**
			 * Gets the config path.
			 *
			 * @returns {string} Config path.
			 */
			get config() {
				return project.paths.config + "*.js";
			},
			grunt: "Gruntfile.js",
			artifact: "artifact",
			php: [
				"*.php",
				"classes/**/*.php",
			],
			phptests: "tests/**/*.php",
			js: [
				"js/src/**/*.js",
			],
			pot: {
				yoastWooSeoJs: "<%= paths.languages %>yoast-woo-seo-js.pot",
				gettext: "gettext.pot",
			},
		},
		pkg: grunt.file.readJSON( "package.json" ),
	};

	project.pluginVersionSlug = flattenVersionForFile( pluginVersion );

	// Load Grunt configurations and tasks
	loadGruntConfig( grunt, {
		configPath: path.join( process.cwd(), "node_modules/@yoast/grunt-plugin-tasks/config/" ),
		overridePath: path.join( process.cwd(), project.paths.config ),
		data: project,
		jitGrunt: {
			staticMappings: {
				addtextdomain: "grunt-wp-i18n",
				makepot: "grunt-wp-i18n",
				gittag: "grunt-git",
				gitfetch: "grunt-git",
				gitadd: "grunt-git",
				gitstatus: "grunt-git",
				gitcommit: "grunt-git",
				gitcheckout: "grunt-git",
				gitpull: "grunt-git",
				gitpush: "grunt-git",
				/* eslint-disable-next-line camelcase */
				glotpress_download: "grunt-glotpress",
				"update-version": "./node_modules/@yoast/grunt-plugin-tasks/tasks/update-version.js",
				"set-version": "./node_modules/@yoast/grunt-plugin-tasks/tasks/set-version.js",
				"update-changelog-with-latest-pr-texts": "@yoast/grunt-plugin-tasks",
				"get-latest-pr-texts": "@yoast/grunt-plugin-tasks",
				"update-changelog": "@yoast/grunt-plugin-tasks",
				"build-qa-changelog": "@yoast/grunt-plugin-tasks",
				"download-qa-changelog": "@yoast/grunt-plugin-tasks",
				"update-changelog-to-latest": "@yoast/grunt-plugin-tasks",
			},
		},
	} );
};
