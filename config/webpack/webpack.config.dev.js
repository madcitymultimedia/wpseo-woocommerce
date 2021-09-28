/* global require, module */
const defaults = require( "./webpack.config.default" ).defaults;
const webpack = require( "webpack" );

const devConfig = {
	devtool: "eval",
	optimization: {
		minimize: false,
	},
	plugins: [
		new webpack.DefinePlugin( {
			"process.env": {
				NODE_ENV: JSON.stringify( "development" ),
			},
		} ),
	],
};

module.exports = defaults( devConfig );
