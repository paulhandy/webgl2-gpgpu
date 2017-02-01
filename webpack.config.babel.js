import path from 'path';

module.exports = {
  entry: {
    index: './src/index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['latest']
        }
      }
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '../dist',
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js'
  }
};
