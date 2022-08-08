import "../../common/src/css/hydrogen.css";
import "../src/css/app.css"
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import defaultRichTextElements from "../../common/src/helpers/format";
import IndigenousApprenticeshipFrench from "../src/js/lang/frCompiled.json";
import CommonFrench from "../../common/src/lang";
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

const messages = {en: null, fr: {...IndigenousApprenticeshipFrench, ...CommonFrench} };
setIntlConfig({
    locales: ["en", "fr"],
    defaultLocale: "en",
    getMessages: (locale) => messages[locale],
    defaultRichTextElements
})

export const decorators = [
    withIntl,
    (Story) => (
      <div data-h2-font-family="b(sans)">
        <Story />
      </div>
    ),
  ];
