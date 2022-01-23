var path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

const FOLDER_BUILD = "dist";

module.exports = (env, options) => {
  var dotEnvMode = "development";

  if (env && env.production) {
    dotEnvMode = "production";
  }

  var config = {
    entry: {
      app: "./src/index.tsx",
    },
    output: {
      path: path.resolve(__dirname, FOLDER_BUILD),
      filename: "[name].[hash].bundle.js",
      chunkFilename: "[name].[chunkhash].bundle.js",
    },
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          use: ["source-map-loader"],
          enforce: "pre",
          exclude: /node_modules/,
        },
        {
          test: /\.(ts|js)x?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            { loader: "css-loader", options: { sourceMap: false } },
          ],
        },
      ],
    },
    plugins: [
      new Dotenv({
        path: `./.env.${dotEnvMode}`,
      }),
      new HtmlWebpackPlugin({
        favicon: "./public/favicon.ico",
        template: "./public/index.html",
      }),
    ],
  };

  if (options.mode == "development") {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.devtool = "inline-source-map";
    config.devServer = {
      open: true,
    };
  }

  if (options["analysis_bundle"]) {
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerPort: 8080,
      })
    );
  }

  return config;
};
