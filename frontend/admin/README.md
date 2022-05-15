# Getting Started

1. Ensure PHP (PHP >= 7.3) and Composer are installed
2. Ensure the following extensions are enabled:
    * OpenSSL PHP Extension
    * PDO PHP Extension
    * Mbstring PHP Extension
3. Run `npm install` to install dependencies. After the node packages are installed, run `npm rebuild node-sass` incase vendor folder isn't created. (Error: https://github.com/sass/node-sass/issues/1579).
4. Copy .env.example to .env and configure your local environment. Make sure to add a random string as your APP_KEY and set the API_URL to the GraphQL server's URL.
5. In `frontend/common`: If you are developing run `npm run h2-compile`. This will provide all the H2 style attributes. If you need a production ready css file then run `npm run h2-build`.
6. Run `php artisan lighthouse:print-schema --write` inside the /api sibling project, then run `npm run codegen` in this project.
7. Run `npm run dev` which will bundle up our assets.
8. Visit https://localhost:8080/admin to view page.

# Local Development

## Linting and Formatting
The project is set up to use Prettier for consistent formatting of js and ts files, and Eslint for other linting concerns. You can run `npm run prettier` to run auto formatting, `npm run lint` to see lint warnings, and `npm run lint:fix` for Eslint to fix simple issues.

However, for a better developer experience, you likely want to integrate Eslint and Prettier directly into your IDE. We recommend working in VS Code, and installing the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extensions. With ESLint installed, you should see warnings directly in the editor (you may need to run `ESLint: Restart ESLint Server` in the command pallet first). After Prettier is installed, we recommend setting it as your default code formatter by adding the following to your User settings.json file, allowing you to format your ts and js files with `ctrl + shift + f`:
```
"[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
"[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
},
```
