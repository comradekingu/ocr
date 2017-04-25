/* global __dirname, require, module*/

const webpack = require("webpack");
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require("path");

module.exports = function (env) {
  let target = env.target;

  let libraryName = ["OCA", "Ocr"];

  let plugins = [];
  let outputFile;

  if (target === "production") {
    plugins.push(new UglifyJsPlugin({ minimize: true }));
  }
  outputFile = "ocr[name].min.js";

  const config = {
    entry: {
      app: __dirname + "/src/app.ts",
      personal: __dirname + "/src/personal.ts"
    },
    output: {
      path: __dirname + "/dist",
      filename: outputFile,
      library: libraryName,
      libraryTarget: "umd",
      umdNamedDefine: true
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          enforce: "pre",
          loader: "tslint-loader",
          options: {
            tsConfigFile: "tsconfig.app.json",
          }
        },
        {
          test: /\.ts?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            configFileName: "tsconfig.app.json"
          }
        }
      ],
    },
    resolve: {
      modules: [path.resolve("./src")],
      extensions: [".ts"],
    },
    externals: {
      underscore: { // UMD
        commonjs: "underscore",
        commonjs2: "underscore",
        amd: "underscore",
        root: "_"
      }
    },
    plugins: plugins,
  };

  return config;

}
