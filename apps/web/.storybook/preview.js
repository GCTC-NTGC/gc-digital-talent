
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { setIntlConfig, withIntl } from 'storybook-addon-intl';

import defaultRichTextElements from "@common/helpers/format";
import {
  MockGraphqlDecorator,
  RouterDecorator,
  ThemeDecorator,
  theme
} from "storybook-helpers"

import frCompiled from "../src/lang/frCompiled.json";

import "../../../frontend/common/src/css/hydrogen.css"
import "../../../frontend/common/src/css/common.css"

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

export const globalTypes = {
  theme
}

export const decorators = [
  MockGraphqlDecorator,
  withIntl,
  ThemeDecorator,
  RouterDecorator,
  (Story) => (
    <div data-h2-color="base(black)" data-h2-background="base(background)" data-h2-font-family="base(sans)">
      <Story />
    </div>
  ),
];
