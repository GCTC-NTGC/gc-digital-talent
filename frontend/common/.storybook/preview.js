import "../src/css/hydrogen.css"
import "../src/css/common.css"
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import frCompiled from "../src/lang/frCompiled.json";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const messages = { en: null, fr: frCompiled };
setIntlConfig({
  locales: ["en", "fr"],
  defaultLocale: "en",
  getMessages: (locale) => messages[locale],
})

export const decorators = [
  withIntl,
  (Story) => (
    <div data-h2-font-family="b(sans)">
      <Story />
    </div>
  ),
];
