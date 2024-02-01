const path = require("path");
const { merge } = require("webpack-merge");
const HydrogenPlugin = require("hydrogen-webpack-plugin");
const base = require("@gc-digital-talent/webpack-config/webpack.base.js");
require("dotenv").config({ path: "./.env" });

const basePath = path.resolve(__dirname);

const appUrl = process.env.APP_URL ?? "http://localhost:8000";

const meta = {
  title: process.env.APP_TITLE ?? "GC Digital Talent | Talents numériques du GC",
  description:
    process.env.APP_DESCRIPTION ?? "Recruitment platform for digital jobs in the Government of Canada. Plateforme de recrutement pour les emplois numériques au gouvernement du Canada.",
  url: appUrl,
  domain: process.env.APP_DOMAIN ?? "talent.canada.ca",
  image: `${appUrl}/images/digital-talent/banner.jpg`,
}

module.exports = merge(base(basePath, meta), {
  entry: {
    app: [
      "./src/main.tsx",
      "./src/assets/css/hydrogen.css",
      "./src/assets/css/app.css",
    ],
  },
  plugins: [
    // Run Hydrogen on Webpack's compiler hooks
    new HydrogenPlugin({
      outputFile: path.resolve(__dirname, "./src/assets/css/hydrogen.css"),
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "~": path.resolve(basePath, "./src/"),
    },
  },
  stats: "errors-warnings",
  output: {
    publicPath: "/", // final path for routing
    filename: "[name].[contenthash].js", // file hashing for cache busting
    chunkFilename: "[name].[contenthash].js", // file hashing for cache busting
    path: path.resolve(basePath, "dist"), // output folder
    clean: true, // delete existing files on recompile
  },
});
