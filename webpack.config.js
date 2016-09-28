var webpack = require('webpack');

module.exports = {
  entry: [
    'babel-polyfill',
    './builder_files/js/main.js',
    './builder_files/js/svgxuse.js'
  ],
  output: {
    path: __dirname + '/public/assets/js',
    filename: 'main.js'
  },
  module: {
    preLoaders: [
      {test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/}
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map'   // Create Sourcemaps for the bundle
};
