import {
  FeatureFlagDecorator,
  HelmetDecorator,
  MockGraphqlDecorator,
  ReducedMotionDecorator,
  RouterDecorator,
  ThemeDecorator,
  VIEWPORTS
} from "@gc-digital-talent/storybook-helpers";
import { richTextElements as defaultRichTextElements } from "@gc-digital-talent/i18n";
import frCommonCompiled from "@gc-digital-talent/i18n/frCompiled.json";

import frCompiled from "../src/lang/frCompiled.json";

import "../src/assets/css/hydrogen.css";
import "../src/assets/css/app.css";

const messages = {
  en: null,
  fr: {
    ...frCompiled,
    ...frCommonCompiled,
  },
};

const getMessages = (locale) => messages[locale];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    disable: true
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  intl: {
    locales: ["en", "fr"],
    defaultLocale: "en",
    getMessages,
    defaultRichTextElements,
  },
  viewport: {
    viewports: VIEWPORTS,
  },
};

export const decorators = [
  FeatureFlagDecorator,
  HelmetDecorator,
  ReducedMotionDecorator,
  MockGraphqlDecorator,
  ThemeDecorator,
  RouterDecorator,
  (Story) => (
    <div
      data-h2-color="base(black)"
      data-h2-background="base(background)"
      data-h2-font-family="base(sans)"
    >
      <Story />
    </div>
  ),
];
