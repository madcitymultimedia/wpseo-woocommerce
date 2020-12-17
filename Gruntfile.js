/* global require, process */
const { flattenVersionForFile } = require( "./config/grunt/lib/version.js" );
const timeGrunt = require( "time-grunt" );
const loadGruntConfig = require( "load-grunt-config" );
const path = require( "path" );

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
				glotpress_download: "grunt-glotpress",
				"update-version": "./node_modules/@yoast/grunt-plugin-tasks/tasks/update-version.js",
				"set-version": "./node_modules/@yoast/grunt-plugin-tasks/tasks/set-version.js",
			},
		},
	} );
};
