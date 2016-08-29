const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    style: [
        path.join(__dirname, 'node_modules', 'bootstrap'),
        path.join(__dirname, 'app', 'main.css')
    ],
    build: path.join(__dirname, 'build')
};

const common = {
    entry: {
        style: PATHS.style,
        app: PATHS.app
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './app/bootstrap.html'
        })
    ]
};

var config;

// Detect how npm is run and branch based on that
switch(process.env.npm_lifecycle_event) {
    case 'build':
    case 'stats':
        config = merge(
            common,
            {
                devtool: 'source-map',
                output: {
                    path: PATHS.build,
                    filename: '[name].[hash].js',
                    publicPath: '/facts/'
                }
            },
            parts.clean(PATHS.build),
            //parts.minify(),
            parts.setupHtml(PATHS.app),
            parts.extractCSS(PATHS.style),
            parts.purifyCSS([PATHS.app])
        );
        break;
    default:
        config = merge(
            common,
            {
                devtool: 'eval-source-map'
            },
            parts.devServer({
                // Customize host/port here if needed
                host: process.env.HOST,
                port: process.env.PORT
            }),
            parts.setupHtml(PATHS.app),
            parts.setupCSS(PATHS.style)
        );
}

module.exports = validate(config, {
    quiet: true
});

