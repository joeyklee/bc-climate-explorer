const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: "./src/js/index.js",
        data: "./src/js/Data.js",
        geo: "./src/js/Geo.js",
        helper: "./src/js/Helper.js",
        scatterplot: "./src/js/Scatterplot.js",
        setup: "./src/js/Setup.js",
        timeseries: "./src/js/Timeseries.js",
        controller: "./src/js/Controller.js"
    },
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            PubSub: "pubsub-js",
            mapboxgl: "mapbox-gl",
            d3: "d3",
            turf: "@turf/turf",
            Plotly: "plotly.js-dist"
        }),
        new HtmlWebpackPlugin({
            title: 'BC Climate Explorer - App',
            template: 'index.html'
        }),
         new CopyWebpackPlugin([
            { from: 'src/data', to: 'data/' }
        ])
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            }
        ]
    }
};