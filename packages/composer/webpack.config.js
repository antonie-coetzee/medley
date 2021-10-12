const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  devtool: "inline-source-map",
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      name: "vendor",
      chunks: "all",
    },
  },
  externals: [
    "react-is",
    "react-dom",
    "react",
    "mobx",
    "mobx-react",
    "medley",
    "notistack",
    "@material-ui/styles",
    "@material-ui/core",
    "@material-ui/icons", 
    /@material-ui\/core\/.*/,
    /@material-ui\/icons\/.*/,    
    "@material-ui/lab" ,           
    "@rjsf/material-ui",
    "@rjsf/core",
    "@material-ui/data-grid",
    "react-dnd"
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset/inline",
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
    //plugins: [new TsconfigPathsPlugin()],
    alias: {
      "@": path.resolve(__dirname, "src"),
    } 
  },
  output: {
    libraryTarget: "system",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "index.ejs" }),
    // new BundleAnalyzerPlugin(),
    //new StatoscopeWebpackPlugin()
  ],
};
