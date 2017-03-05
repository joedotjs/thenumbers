const webpack = require('webpack');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {

    const removeEmpty = a => a.filter(e => !!e);
    const ifProd = v => env.prod ? v : null;
    const ifDev = v => env.dev ? v : null;

    process.env.BABEL_ENV = ifProd('production') || 'development';

    const BABEL_LOADER_CONFIG = {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
            presets: removeEmpty([
                ifDev('react-hmre'),
                'es2015-webpack',
                'react'
            ])
        }
    };

    const CSS_LOADER_CONFIG = {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
    };

    return {
        entry: {
            app: removeEmpty([
                path.resolve('./browser', 'main.js'),
                ifDev('webpack-hot-middleware/client')
            ]),
            vendor: [
                'axios',
                'react',
                'lodash',
                'bluebird',
                'react-router',
                'react-dom',
                'react-addons-css-transition-group',
                'redux'
            ]
        },
        devtool: ifProd('source-map') || 'eval',
        bail: env.prod,
        output: {
            path: path.resolve('./public'),
            publicPath: ifDev('http://localhost:3001/') || 'http://thenumbers.rocks',
            filename: '[name].[hash].js'
        },
        context: path.resolve('./browser'),
        module: {
            loaders: [
                BABEL_LOADER_CONFIG,
                CSS_LOADER_CONFIG
            ]
        },
        plugins: removeEmpty([

            ifDev(new webpack.HotModuleReplacementPlugin()),
            ifDev(new webpack.NoErrorsPlugin()),

            ifProd(new webpack.optimize.UglifyJsPlugin()),
            ifProd(new webpack.optimize.DedupePlugin()),
            ifProd(new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            })),
            ifProd(new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: '"production"'
                }
            })),

            new webpack.optimize.OccurrenceOrderPlugin(),
            new HTMLWebpackPlugin({
                template: './index.html'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.js'
            })

        ])
    };
};