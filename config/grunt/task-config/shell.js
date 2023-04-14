// See https://github.com/sindresorhus/grunt-shell
module.exports = function( grunt ) {
	return {
		"composer-install": {
			command: "composer install --no-interaction",
		},

		"php-lint": {
			command: "composer lint",
		},

		phpcs: {
			command: "composer check-cs",
		},

		"combine-pot-files": {
			fromFiles: [
				"languages/<%= pkg.plugin.textdomain %>-temp.pot",
				"<%= files.pot.yoastWooSeoJs %>",
			],
			toFile: "languages/<%= pkg.plugin.textdomain %>.pot",
			command: () => {
				const fromFiles = grunt.config.get( "shell.combine-pot-files.fromFiles" );
				const toFile = grunt.config.get( "shell.combine-pot-files.toFile" );

				return "msgcat" +
					" --use-first" +
					" " + fromFiles.join( " " ) +
					" > " + toFile;
			},
		},
	};
};
