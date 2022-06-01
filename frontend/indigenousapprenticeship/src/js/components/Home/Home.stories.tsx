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

export const EnglishHomeStory = TemplateEnglishHome.bind({});

export const FrenchHomeStory = TemplateFrenchHome.bind({});
