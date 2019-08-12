const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


const isDevBuild = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDevBuild ? 'none' : 'production',
  entry: './scripts/index.js',
  // watch: true,
  devtool: isDevBuild ? 'source-map' : 'none',
  devServer: {
    contentBase: './dist',
  },
  output: {
    filename: 'bundle.[hash:4].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html',
    })
  ]
};