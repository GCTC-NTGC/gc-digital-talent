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

`import { useLocation } from "@common/helpers/router";`

`import Table from "@common/components/Table";`

### Notes on the solution

In step 1 above, the first alias allows you to easily import from the common folder. The other aliases ensure only one copy of React is used as a dependency, which avoids the "Hooks can only be called inside the body of a function component" error with React hooks.

Step 2 allows TypeScript to recognize the same alias, both when building and when linting.

Step 3 will resolve the "no-unresolved" eslint error when importing using the "@common" alias.

Unfortunately, I do not know a good way around the "no-extraneous-dependencies" eslint error, hence turning that rule off entirely in step 4.

## Translation Utility script

This project contains a script (`src/tooling/checkIntl.js`) to help manage your react-intl translations files. It has been written to run without any dependencies or compilation. It is expected to be used along with the [formatjs cli](https://formatjs.io/docs/tooling/cli).

### Directions
The checkIntl script can be run with different flags and options. For more details on how individual options work, see the checkIntl file itself. In practice, it is easiest to save the commands, with options included, as **package.json** scripts.

Note: each project using react-intl (e.g. admin, common, talentsearch, etc.) requires its own set of commands, and must be managed separately.

For example, to ensure translations in the admin project are up to date:
1. Run `npm run intl-extract` in the project you are managing (in this case, /admin).
2. Run `npm run check-intl-admin` (from the /common folder). This generates a **untranslated.json** file in the admin project's lang folder.
3. Send **untranslated.json** for translation, asking them to only translate the "defaultMessage" fields.
4. Save the translated version which comes back as **newTranslations.json** in the same lang folder.
5. Run `npm run check-intl-admin-merge` (again from the /common folder).
6. If you see any warnings about untranslated entries which simply match in English and French, add the key to the array in **whitelist.json** and repeat step 4.
7. Run `npm run intl-compile` in the /admin folder.

### On source control
Only **fr.json** and **whitelist.json** need to be checked into source control. The other files created during this process are generated as needed or only used to communicate with translators, should be added to .gitignore, and may be deleted after use.



