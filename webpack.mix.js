const mix = require("laravel-mix");

require('laravel-mix-polyfill');

mix.ts("resources/js/app.tsx", "public/js")
  .css("resources/css/hydrogen.css", "public/css")
  .polyfill({
  enabled: true,
  useBuiltIns: "usage",
  targets: "firefox 50, IE 11"
});

mix.version();
