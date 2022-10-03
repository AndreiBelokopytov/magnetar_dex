const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const APP_STRUCTURE = {
  public: path.resolve(__dirname, "../public"),
  src: path.resolve(__dirname, "../src"),
  dist: path.resolve(__dirname, "../dist"),
};

module.exports = {
  entry: path.join(APP_STRUCTURE.src, "index.tsx"),
  output: {
    path: APP_STRUCTURE.dist,
    filename: "[name].bundle.js",
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      config:
        process.env.NODE_ENV === "production"
          ? path.resolve(__dirname, "../configs/config.prod")
          : path.resolve(__dirname, "../configs/config"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|json)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpeg|jpg|gif)/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(APP_STRUCTURE.public, "index.html"),
    }),
  ],
};
