var webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: {
        app: './src/app.js',
    },
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
    },
    module: {
        // Loaders that are used to load files
        loaders: [
            // Babel loader to transpile ES2015 to ES5 code
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
            },

            // Css loader to load stylesheets
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },

            // Scss loader to allow webpack to transform scss code to css
            {
                test: /\.scss$/,
                loader: 'style!css!sass',
            },
        ],
    },
};
