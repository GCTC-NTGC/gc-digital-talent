FROM node:20.11.0

WORKDIR /var/www/html/apps/web

RUN npm install --location=global pnpm@8.15

CMD npx webpack serve --config webpack.dev.js
