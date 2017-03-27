module.exports = {
    entry: './src/enemy-comes/main.ts',
    output: {
        path: __dirname + '/src',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'awesome-typescript-loader' }
        ]
    }
};