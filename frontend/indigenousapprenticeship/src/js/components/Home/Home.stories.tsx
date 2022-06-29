import React from "react";
import type { Meta, Story } from "@storybook/react";
import { IntlProvider } from "react-intl";
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
  375, // Modern iPhone
  1366, // Most common viewport size that falls within chromatic range
];

export const EnglishHomeStory = TemplateEnglishHome.bind({});

EnglishHomeStory.parameters = {
  chromatic: { viewports: VIEWPORTS },
};

export const FrenchHomeStory = TemplateFrenchHome.bind({});

FrenchHomeStory.parameters = {
  chromatic: { viewports: VIEWPORTS },
};
