// See https://github.com/sindresorhus/grunt-shell
module.exports = function() {
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
	};
};
