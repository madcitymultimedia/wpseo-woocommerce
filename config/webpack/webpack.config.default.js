const _defaultsDeep = require( "lodash.defaultsdeep" );
const path = require( "path" );
const pkg = require( "../../package.json" );
const { camelCaseDash } = require( "@wordpress/dependency-extraction-webpack-plugin/lib/util" );
const UnminifiedWebpackPlugin = require( "unminified-webpack-plugin" );
const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );
const { flattenVersionForFile } = require( "../grunt/lib/version.js" );
const BundleAnalyzerPlugin = require( "webpack-bundle-analyzer" ).BundleAnalyzerPlugin;

const webpack = require( "webpack" );

const externals = {
	yoastseo: "yoast.analysis",
	lodash: "window.lodash",
	"lodash-es": "window.lodash",
};
let analyzerPort = 8888;

/**
 * WordPress dependencies.
 */
const wordpressPackages = [
	"@wordpress/hooks",
	"@wordpress/data",
	"@wordpress/i18n",
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
		"yoastseo-woo-identifiers": path.join( __dirname, "../../", "js/src/yoastseo-woo-identifiers.js" ),
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
		new BundleAnalyzerPlugin( {
			analyzerPort: analyzerPort++,
		} ),
	],
};


const defaults = ( config ) => {
	return _defaultsDeep( config, defaultConfig );
};

module.exports = {
	defaults,
};
