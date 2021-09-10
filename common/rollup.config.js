import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";

const resources = ["components", "constants", "helpers", "messages"];
const packageJson = require("./package.json");
const plugins = [
  peerDepsExternal({
    includeDependencies: true,
  }),
  resolve(),
  commonjs(),
  typescript({ useTsconfigDeclarationDir: true }),
  postcss({
      extensions: ['.css']
  })
];

const modules = resources.map((resource) => ({
  input: `src/${resource}/index.ts`,
  output: [
    {
      file: `lib/${resource}/index.js`,
      format: "cjs",
      sourcemap: true
    },
    {
      file: `lib/${resource}/index.esm.js`,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins
}));

export default [{
  input: "src/index.ts",
  output: [
    {
      file: packageJson.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true
    }
  ],
  plugins,
},
  ...modules
];
