require('dotenv').config();
require('laravel-mix-polyfill');

const mix = require("laravel-mix");

let webpack = require('webpack')
let dotenvplugin = new webpack.DefinePlugin({
  'process.env': {
      API_URI: process.env.API_URI
  }
})

mix.ts("resources/js/dashboard.tsx", "public/js")
  .css("resources/css/hydrogen.css", "public/css")
  .css("resources/css/app.css", "public/css")
  .polyfill({
  enabled: true,
  useBuiltIns: "usage",
  targets: "firefox 50, IE 11"
});

mix.webpackConfig({
  plugins: [
    dotenvplugin,
  ]
});

mix.version();
