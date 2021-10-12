# Welcome to the GC Digital Talent Common folder

This folder is meant to hold code shared between multiple other subprojects. In practice, this currently extends only to React components and other TypeScript code. 

We've set up our projects as subfolders which can import directly from this folder. As such, it is not necessary to build, bundle or deploy the Common folder as a node module. It _is_ still necessary to include dependencies of Common code in the local package.json file.

## How to import from Common folder

To import code from this folder in another Javascript package in a sibling folder, follow these steps:

1. In the webpackConfig object of `webpack.mix.js` (or your webpack.config.js file, if separate) add the following code:
    
    ```
    resolve: {
        alias: {
          "@common": path.resolve('../common/src'),
          "react": path.resolve('./node_modules/react'),
          "react-dom": path.resolve('./node_modules/react-dom'),
          "react-hook-form": path.resolve('./node_modules/react-hook-form'),
        }
      }
    ```
    If using Storybook, you will need to add the same aliases to [Storybook's webpack](https://storybook.js.org/docs/react/configure/webpack) config as well.

2. Add the following code to `tsconfig.json`:
    ```
    "baseUrl": "./",
    "paths": {
        "@common/*": ["../common/src/*"],
    },
    ```

3. If using ESLint with the [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) plugin (note: this in included in airbnb's eslint config), then install the [eslint-import-resolver-alias](https://www.npmjs.com/package/eslint-import-resolver-alias) plugin. Then, ensure your .eslint config file includes the following "alias" block, nested as shown:
    ```
    "settings": {
      "import/resolver": {
        "alias": {
          "map": [
            ["@common", "../common/src"]
          ],
          "extensions": [
            ".js",
            ".jsx",
            ".ts",
            ".tsx"
          ]
        }
      }
    }
    ```

4. (If you did step 3.) Turn off the "no-extraneous-dependencies" eslint rule by adding `"import/no-extraneous-dependencies": "off",` to the rules section of .eslintrc

### Done!
Now you can import common code into your TypeScript files by prefixing the import statement with "@common", and everything (linting, introspection, and building) should work correctly. Some examples:

`import { Link } from "@common/helpers/router";`

`import Table from "@common/components/Table";`

### Notes on the solution

In step 1 above, the first alias allows you to easily import from the common folder. The other aliases ensure only one copy of React is used as a dependency, which avoids the "Hooks can only be called inside the body of a function component" error with React hooks.

Step 2 allows TypeScript to recognize the same alias, both when building and when linting.

Step 3 will resolve the "no-unresolved" eslint error when importing using the "@common" alias.

Unfortunately, I do not know a good way around the "no-extraneous-dependencies" eslint error, hence turning that rule off entirely in step 4.

### Translation Utility script

This project contains a script (`src/tooling/checkIntl.js`) to help manage your react-intl translations files. It has been written to run without any dependencies or compilation. It is expected to be used along with the [formatjs cli](https://formatjs.io/docs/tooling/cli). Here are the recommended steps to handling translation:

1. Run [formatjs extract](https://formatjs.io/docs/tooling/cli#extraction) to generate an **en.json** file with all your original strings.
    - If this is the first time running this, also create an **fr.json** file consisting of an empty object `{}`, and a **whitelist.json** file consisting of an empty array `[]`.
2. Run `checkIntl` with options specifying your `--en`, `--fr` and `--whitelist` files to check whether your **fr.json** file is up to date. This is the simplest use of the checkIntl script.
3. More than likely you actually want to fix the fr file if you have untranslated strings. To this end, run `checkIntl` with the previous options, along with the `--output-untranslated` and `--rm-orphaned` options (a new file path and a boolean flag, respectively).
4. Provide the outputted **untranslated** file to your translators, asking them to only change _defaultMessage_ field for each entry.
5. When you receive the file back from your translators, save it under a new name and rerun `checkIntl` with all the previous options, along with the `--merge-fr` option (a path to the new file).
6. If, after translation, some entries are the same in English and French, add the keys to **whitelist.json**.
7. Run [formatjs compile](https://formatjs.io/docs/tooling/cli#compilation) to transform **fr.json** into **frCompiled.json**. This latter file is what react-intl must load messages from.

### On source control
Only **fr.json** and **whitelist.json** need to be checked into source control. The other files created during this process are generated as needed or only used to communicate with translators, and may be deleted after use.

### On running the commands
It is most convenient to save the commands from step 3 and step 5 as scripts in a **package.json** file. For example, `npm run check-intl-admin` and `npm run check-intl-admin-merge` will execute those commands for the **/admin** folder.


