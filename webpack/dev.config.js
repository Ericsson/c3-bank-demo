
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackErrorNotificationPlugin = require('webpack-error-notification')
var autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    bundle: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/index.js',
    ],
    cct: './src/cct.js',
    jspdf: './src/jspdf.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
    }, {
      test: /\.scss$/,
      loader: 'style!css!postcss!resolve-url!sass?sourceMap',
    }, {
      test: /\.css$/,
      loader: 'style!css!postcss!resolve-url',
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream',
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file',
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml',
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
      ],
    }],
  },
  postcss: function () {
    return [autoprefixer]
  },
  resolve: {
    extensions: ['', '.js', '.scss', '.css'],
  },
  output: {
    path: path.join(__dirname, '../dist'),
    publicPath: '',
    filename: '[name].js',
  },
  devServer: {
    contentBase: './dist',
    inline: true,
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WebpackErrorNotificationPlugin(),
    new HtmlWebpackPlugin({
      title: 'Web Meeting PoC',
      hash: true,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
  ],
}
