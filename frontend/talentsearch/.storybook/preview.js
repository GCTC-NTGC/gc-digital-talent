import "../resources/css/hydrogen.css"
import "../resources/css/app.css"
import "../resources/js/components/IntlContainer";
import { setIntlConfig, withIntl } from 'storybook-addon-intl';
import TalentSearchFrench from "../resources/js/lang/frCompiled.json";
import CommonFrench from "../../common/src/lang/frCompiled.json";

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

const messages = {en: null, fr: {...TalentSearchFrench, ...CommonFrench} };
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
