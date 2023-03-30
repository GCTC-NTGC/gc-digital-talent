const path = require("path");
const shell = require("shelljs");
const fs = require("fs");

class HydrogenPlugin {
  static defaultOptions = {
    // Full path of the hydrogen output file
    outputFile: "./css/hydrogen.css",
  };

  constructor(options = {}) {
    this.options = { ...HydrogenPlugin.defaultOptions, ...options };
  }

  apply(compiler) {
    const pluginName = HydrogenPlugin.name;

    compiler.hooks.invalid.tap(pluginName, () => {
      shell.exec(`h2-build`);
      var f = path.resolve(this.options.outputFile);
      var now = Date.now() / 1000;
      var then = now - 100;
      fs.utimes(f, then, then, function (err) {
        if (err) throw err;
      });
    });
  }
}

module.exports = HydrogenPlugin;
