import "../../common/src/css/common.css";
import "../../common/src/css/hydrogen.css";
import "../src/css/app.css"
import "../src/js/components/IntlContainer";
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import AdminFrench from "../src/js/lang/frCompiled.json";
import CommonFrench from "../../common/src/lang";

// CSS files required for building with `MERGE_STORYBOOKS=true`.
import "../../talentsearch/src/css/app.css";

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

const messages = {en: null, fr: {...AdminFrench, ...CommonFrench}};
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
