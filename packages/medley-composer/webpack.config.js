const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  externals: [
    "react-is",
    "react-dom",
    "react",
    "mobx",
    "mobx-react",
    "medley",
    "@material-ui/styles",
    "@material-ui/core",
    "@material-ui/lab" ,           
    "@rjsf/material-ui",
    "@rjsf/core",
    "@material-ui/data-grid",
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: 'asset/inline'
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    libraryTarget: "system",
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    //hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({template:"index.ejs"}),
    //new BundleAnalyzerPlugin()
  ]
};
