const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin")

const utils = require('./utils.js');

module.exports = (options) => {
    const DATAS = {
        VERSION: `'${utils.parseVersion()}'`,
        DEBUG_INFO_ENABLED: options.env === 'development'
    };
    return {
        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['node_modules']
        },
        module: {
            rules: [
                { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports-loader?jQuery=jquery' },
                {
                    test: /\.html$/,
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        caseSensitive: true,
                        removeAttributeQuotes:false,
                        minifyJS:false,
                        minifyCSS:false
                    },
                    exclude: ['./src/main/webapp/index.html']
                },
                {
                    test: /\.scss$/,
                    loaders: ['to-string-loader', 'css-loader', 'sass-loader'],
                    exclude: /(vendor\.scss|global\.scss)/
                },
                {
                    test: /(vendor\.scss|global\.scss)/,
                    loaders: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
                },
                {
                    test: /\.css$/,
                    loaders: ['to-string-loader', 'css-loader'],
                    exclude: /(vendor\.css|global\.css)/
                },
                {
                    test: /(vendor\.css|global\.css)/,
                    loaders: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
                    loaders: ['file-loader?hash=sha512&digest=hex&name=content/[hash].[ext]']
                },
                {
                    test: /manifest.webapp$/,
                    loader: 'file-loader?name=manifest.webapp!web-app-manifest-loader'
                },
                {
                    test: /app.constants.ts$/,
                    loader: StringReplacePlugin.replace({
                        replacements: [{
                            pattern: /\/\* @toreplace (\w*?) \*\//ig,
                            replacement: (match, p1, offset, string) => `_${p1} = ${DATAS[p1]};`
                        }]
                    })
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify(options.env)
                }
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'polyfills',
                chunks: ['polyfills']
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                chunks: ['main'],
                minChunks: module => utils.isExternalLib(module)
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['polyfills', 'vendor'].reverse()
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['manifest'],
                minChunks: Infinity,
            }),
            /**
             * See: https://github.com/angular/angular/issues/11580
             */
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)@angular/,
                utils.root('src/main/webapp/app'), {}
            ),
            new CopyWebpackPlugin([
                { from: './node_modules/core-js/client/shim.min.js', to: 'core-js-shim.min.js' },
                { from: './node_modules/swagger-ui/dist', to: 'swagger-ui/dist' },
                { from: './src/main/webapp/swagger-ui/', to: 'swagger-ui' },
                { from: './src/main/webapp/favicon.ico', to: 'favicon.ico' },
                { from: './src/main/webapp/manifest.webapp', to: 'manifest.webapp' },
                // { from: './src/main/webapp/sw.js', to: 'sw.js' },
                { from: './src/main/webapp/robots.txt', to: 'robots.txt' }
            ]),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),
            new MergeJsonWebpackPlugin({
                output: {
                    groupBy: [
                        { pattern: "./src/main/webapp/i18n/en/*.json", fileName: "./target/www/i18n/en.json" },
                        { pattern: "./src/main/webapp/i18n/hy/*.json", fileName: "./target/www/i18n/hy.json" },
                        { pattern: "./src/main/webapp/i18n/ca/*.json", fileName: "./target/www/i18n/ca.json" },
                        { pattern: "./src/main/webapp/i18n/zh-cn/*.json", fileName: "./target/www/i18n/zh-cn.json" },
                        { pattern: "./src/main/webapp/i18n/zh-tw/*.json", fileName: "./target/www/i18n/zh-tw.json" },
                        { pattern: "./src/main/webapp/i18n/cs/*.json", fileName: "./target/www/i18n/cs.json" },
                        { pattern: "./src/main/webapp/i18n/da/*.json", fileName: "./target/www/i18n/da.json" },
                        { pattern: "./src/main/webapp/i18n/nl/*.json", fileName: "./target/www/i18n/nl.json" },
                        { pattern: "./src/main/webapp/i18n/et/*.json", fileName: "./target/www/i18n/et.json" },
                        { pattern: "./src/main/webapp/i18n/fa/*.json", fileName: "./target/www/i18n/fa.json" },
                        { pattern: "./src/main/webapp/i18n/fr/*.json", fileName: "./target/www/i18n/fr.json" },
                        { pattern: "./src/main/webapp/i18n/gl/*.json", fileName: "./target/www/i18n/gl.json" },
                        { pattern: "./src/main/webapp/i18n/de/*.json", fileName: "./target/www/i18n/de.json" },
                        { pattern: "./src/main/webapp/i18n/el/*.json", fileName: "./target/www/i18n/el.json" },
                        { pattern: "./src/main/webapp/i18n/hi/*.json", fileName: "./target/www/i18n/hi.json" },
                        { pattern: "./src/main/webapp/i18n/hu/*.json", fileName: "./target/www/i18n/hu.json" },
                        { pattern: "./src/main/webapp/i18n/it/*.json", fileName: "./target/www/i18n/it.json" },
                        { pattern: "./src/main/webapp/i18n/ja/*.json", fileName: "./target/www/i18n/ja.json" },
                        { pattern: "./src/main/webapp/i18n/ko/*.json", fileName: "./target/www/i18n/ko.json" },
                        { pattern: "./src/main/webapp/i18n/mr/*.json", fileName: "./target/www/i18n/mr.json" },
                        { pattern: "./src/main/webapp/i18n/pl/*.json", fileName: "./target/www/i18n/pl.json" },
                        { pattern: "./src/main/webapp/i18n/pt-br/*.json", fileName: "./target/www/i18n/pt-br.json" },
                        { pattern: "./src/main/webapp/i18n/pt-pt/*.json", fileName: "./target/www/i18n/pt-pt.json" },
                        { pattern: "./src/main/webapp/i18n/ro/*.json", fileName: "./target/www/i18n/ro.json" },
                        { pattern: "./src/main/webapp/i18n/ru/*.json", fileName: "./target/www/i18n/ru.json" },
                        { pattern: "./src/main/webapp/i18n/sk/*.json", fileName: "./target/www/i18n/sk.json" },
                        { pattern: "./src/main/webapp/i18n/sr/*.json", fileName: "./target/www/i18n/sr.json" },
                        { pattern: "./src/main/webapp/i18n/es/*.json", fileName: "./target/www/i18n/es.json" },
                        { pattern: "./src/main/webapp/i18n/sv/*.json", fileName: "./target/www/i18n/sv.json" },
                        { pattern: "./src/main/webapp/i18n/tr/*.json", fileName: "./target/www/i18n/tr.json" },
                        { pattern: "./src/main/webapp/i18n/ta/*.json", fileName: "./target/www/i18n/ta.json" },
                        { pattern: "./src/main/webapp/i18n/th/*.json", fileName: "./target/www/i18n/th.json" },
                        { pattern: "./src/main/webapp/i18n/ua/*.json", fileName: "./target/www/i18n/ua.json" },
                        { pattern: "./src/main/webapp/i18n/vi/*.json", fileName: "./target/www/i18n/vi.json" }
                        // jhipster-needle-i18n-language-webpack - JHipster will add/remove languages in this array
                    ]
                }
            }),
            new HtmlWebpackPlugin({
                template: './src/main/webapp/index.html',
                chunksSortMode: 'dependency',
                inject: 'body'
            }),
            new StringReplacePlugin()
        ]
    };
};
