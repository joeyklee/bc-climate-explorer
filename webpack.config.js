const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./src/js/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            PubSub: "pubsub-js",
            mapboxgl: "mapbox-gl"
        })
    ],
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }, {
                loader: "sass-loader"
            }]
        }]
    }
};