
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from "@storybook/addon-viewport";
import { setIntlConfig, withIntl } from 'storybook-addon-intl';

import {
  HelmetDecorator,
  MockGraphqlDecorator,
  RouterDecorator,
  ThemeDecorator,
  theme
} from "storybook-helpers"
import { richTextElements as defaultRichTextElements } from "@gc-digital-talent/i18n";
import frCommonCompiled from "@gc-digital-talent/i18n/src/lang/frCompiled.json"

import frCompiled from "../src/lang/frCompiled.json";

import "../src/assets/css/hydrogen.css"
import "../src/assets/css/app.css"

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
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...MINIMAL_VIEWPORTS,
    },
  },
}

const messages = {
  en: null,
  fr: {
    ...frCompiled,
    ...frCommonCompiled
  }
};
setIntlConfig({
  locales: ["en", "fr"],
  defaultLocale: "en",
  getMessages: (locale) => messages[locale],
  defaultRichTextElements
})

export const globalTypes = {
  theme
}

export const decorators = [
  HelmetDecorator,
  MockGraphqlDecorator,
  withIntl,
  ThemeDecorator,
  RouterDecorator,
  (Story) => (
    <div data-h2-font-family="base(sans)">
      <Story />
    </div>
  ),
];
