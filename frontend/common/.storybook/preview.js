import "../src/css/hydrogen.vars.css";
import "../src/css/hydrogen.css"
import "../src/css/common.css"
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import frCompiled from "../src/lang/frCompiled.json";
import defaultRichTextElements from "../src/helpers/format";
import MockGraphqlDecorator from "../../common/.storybook/decorators/MockGraphqlDecorator";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

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
  viewport: {
    // for possible values: https://github.com/storybookjs/storybook/blob/master/addons/viewport/src/defaults.ts
    viewports: INITIAL_VIEWPORTS
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
    <div data-h2>
      <div data-h2-font-family="base(sans)">
        <Story />
      </div>
    </div>
  ),
];
