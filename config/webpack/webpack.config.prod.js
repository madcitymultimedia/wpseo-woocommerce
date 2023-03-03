/* global require, module */
const defaults = require( "./webpack.config.default" ).defaults;
const BundleAnalyzerPlugin = require( "webpack-bundle-analyzer" ).BundleAnalyzerPlugin;

const isAnalyzing = "analyze" === process.env.NODE_ANALYZE;

const prodConfig = {
	devtool: false,
	mode: "production",
	plugins: [
		isAnalyzing && new BundleAnalyzerPlugin(),
	],
};

module.exports = defaults( prodConfig );
