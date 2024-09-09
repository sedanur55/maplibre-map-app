// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                type: 'asset/resource', // Webpack 5'te bu şekilde
                generator: {
                    filename: 'assets/icons/[name].png',
                },
            },
            {
                test: /\.svg$/,
                use: ['file-loader'], // veya 'url-loader' kullanabilirsiniz
            },
        ],
    },
    resolve: {
        fallback: {
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
            "timers": require.resolve("timers-browserify")
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.DefinePlugin({
            'process.env.REACT_APP_IBB_API_V3': JSON.stringify(process.env.REACT_APP_IBB_API_V3),
            'process.env.REACT_APP_ALLCORS': JSON.stringify(process.env.REACT_APP_ALLCORS),
        }),
    ],
    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'dist'),
            },
            {
                directory: path.join(__dirname, 'public'),
            },
        ], port: 3000,
        proxy: [
            {
                context: ['/api'],
                target: 'https://data.ibb.gov.tr',
                changeOrigin: true,
                secure: false,
                pathRewrite: { '^/api': '' },
            }
        ],
    },
    mode: 'development',
};
