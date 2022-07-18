import "../src/css/hydrogen.css"
import "../src/css/common.css"
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import frCompiled from "../src/lang/frCompiled.json";
import defaultRichTextElements from "../src/helpers/format";
import MockGraphqlDecorator from "../../common/.storybook/decorators/MockGraphqlDecorator";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    // Set default to "light gray" rather that default "white", to better catch
    // components with transparent backgrounds.
    default: 'light',
  },
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
  defaultRichTextElements
})

export const decorators = [
  MockGraphqlDecorator,
  withIntl,
  (Story) => (
    <div data-h2-font-family="b(sans)">
      <Story />
    </div>
  ),
];
