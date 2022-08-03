import React from "react";
import type { Meta, Story } from "@storybook/react";
import { IntlProvider } from "react-intl";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { widthOf } from "@common/helpers/storybookUtils";
import * as IAPFrench from "../../lang/frCompiled.json";
import Home from "./Home";

export default {
  component: Home,
  title: "Indigenous Apprenticeship/Home Page",
  parameters: {
    backgrounds: {
      default: "white",
    },
  },
} as Meta;

const TemplateEnglishHome: Story = () => <Home />;

const TemplateFrenchHome: Story = () => {
  return (
    <IntlProvider locale="fr" key="fr" messages={IAPFrench}>
      <Home />
    </IntlProvider>
  );
};

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  widthOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const EnglishHomeStory = TemplateEnglishHome.bind({});

EnglishHomeStory.parameters = {
  chromatic: { viewports: VIEWPORTS },
};

export const FrenchHomeStory = TemplateFrenchHome.bind({});

FrenchHomeStory.parameters = {
  chromatic: { viewports: VIEWPORTS },
};
