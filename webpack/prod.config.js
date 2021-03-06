var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = function () {
  return {
    entry: [
      './src/cct.js',
      './src/jspdf.js',
      './src/index.js',
    ],
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader?sourceMap',
        // use: ExtractTextPlugin.extract('style-loader!css-loader!sass-loader?sourceMap'),
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        // use: ExtractTextPlugin.extract('style-loader!css-loader'),
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          // 'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },

      ],
    },
    resolve: {
      extensions: ['jsx', '.js', '.scss', '.css'],
    },
    output: {
      path: path.join(__dirname, '../dist'),
      publicPath: '',
      filename: '[name].js',
    },
    devServer: {
      historyApiFallback: true,
      disableHostCheck: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      contentBase: './dist',
      inline: true,
      hot: true,
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: true,
        },
        sourceMap: false,
      }),
      new HtmlWebpackPlugin({
        title: 'Web Meeting PoC',
        hash: true,
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: '"production"',
        },
      }),
      // new ExtractTextPlugin('bundle.css'),
    ],
  }
}
