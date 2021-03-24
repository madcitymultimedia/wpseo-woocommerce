const _defaultsDeep = require( "lodash.defaultsdeep" );
const path = require( "path" );
const pkg = require( "../../package.json" );
const { camelCaseDash } = require( "@wordpress/dependency-extraction-webpack-plugin/lib/util" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );
const { flattenVersionForFile } = require( "../grunt/lib/version.js" );
const webpack = require( "webpack" );

const externals = {
	yoastseo: "yoast.analysis",
};

/**
 * WordPress dependencies.
 */
const wordpressPackages = [
	"@wordpress/hooks",
	"@wordpress/data",
];

// WordPress packages.
const wordpressExternals = wordpressPackages.reduce( ( memo, packageName ) => {
	const name = camelCaseDash( packageName.replace( "@wordpress/", "" ) );

	memo[ packageName ] = `window.wp.${ name }`;
	return memo;
}, {} );

const pluginVersionSlug = flattenVersionForFile( pkg.yoast.pluginVersion );

const defaultConfig = {
	mode: "production",
	devtool: "cheap-module-eval-source-map",
	entry: {
		"yoastseo-woo-plugin": path.join( __dirname, "../../", "js/src/yoastseo-woo-plugin.js" ),
		"yoastseo-woo-replacevars": path.join( __dirname, "../../", "js/src/yoastseo-woo-replacevars.js" ),
		"yoastseo-woo-worker": path.join( __dirname, "../../", "js/src/yoastseo-woo-worker.js" ),
	},
	output: {
		path: path.join( __dirname, "../../", "js/dist" ),
		filename: "[name]-" + pluginVersionSlug + ".js",
	},
	externals: {
		...externals,
		...wordpressExternals,
	},
	optimization: {
		minimize: true,
	},
	plugins: [
		new webpack.DefinePlugin( {
			"process.env": {
				NODE_ENV: JSON.stringify( "production" ),
			},
		} ),
		new UnminifiedWebpackPlugin(),
		new CaseSensitivePathsPlugin(),
	],
};


const defaults = ( config ) => {
	return _defaultsDeep( config, defaultConfig );
};

module.exports = {
	defaults,
};
