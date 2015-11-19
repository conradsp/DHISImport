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
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    stage: 2,
                },
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader',
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass',
            },
        ],
    },
    plugins: [
        // Plugins to extend webpack functionality (https://webpack.github.io/docs/plugins.html)
        /* Example that provides `fetch` as a global variable
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
        */
    ],
};
