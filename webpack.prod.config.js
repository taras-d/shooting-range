var webpack = require('webpack');

module.exports = {
    entry: './src/shooting-range/game.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'shooting-range.min.js'
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'awesome-typescript-loader' }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};