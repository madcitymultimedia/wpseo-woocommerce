// https://github.com/markoheijnen/grunt-glotpress
module.exports = () => {
	 /* eslint-disable camelcase */
	return {
		plugin: {
			options: {
				url: "<%= pkg.plugin.glotpress %>/app/",
				domainPath: "<%= paths.languages %>",
				file_format: "%domainPath%/%textdomain%-%wp_locale%.%format%",
				namespace: "yoast",
				downloadsUseApi: false,
				slug: "<%= pkg.plugin.slug %>",
				textdomain: "<%= pkg.plugin.textdomain %>",
				formats: [ "mo" ],
				filter: {
					translation_sets: false,
					minimum_percentage: 50,
					waiting_strings: false,
				},
				batchSize: 5,
			},
		},
	};
	/* eslint-enable camelcase */
};
