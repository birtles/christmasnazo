const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    modules: [
      path.resolve(__dirname, './src'),
      'node_modules',
    ],
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    }),
  ],
};
