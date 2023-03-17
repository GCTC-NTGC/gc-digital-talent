import { NestedLanguageProvider, Messages } from "@gc-digital-talent/i18n";
import { StoryFn } from "@storybook/react";

import * as crgMessages from "~/lang/crgCompiled.json";
import * as crkMessages from "~/lang/crkCompiled.json";
import * as ojwMessages from "~/lang/ojwCompiled.json";
import * as micMessages from "~/lang/micCompiled.json";

const messages: Map<string, Messages> = new Map([
  ["crg", crgMessages],
  ["crk", crkMessages],
  ["ojw", ojwMessages],
  ["mic", micMessages],
]);

const NestedLanguageProviderDecorator = (Story: StoryFn) =>  <NestedLanguageProvider messages={messages}><Story /></NestedLanguageProvider>;

export default NestedLanguageProviderDecorator;
