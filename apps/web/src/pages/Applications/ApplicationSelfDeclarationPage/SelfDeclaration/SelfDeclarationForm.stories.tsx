import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

import { widthOf, heightOf } from "storybook-helpers";

import SelfDeclarationForm from "./SelfDeclarationForm";

export default {
  component: SelfDeclarationForm,
  title: "Forms/Self-Declaration Form",
  parameters: {
    themeKey: "iap",
  },
} as ComponentMeta<typeof SelfDeclarationForm>;

const Template: ComponentStory<typeof SelfDeclarationForm> = () => (
  <SelfDeclarationForm onSubmit={(values) => action("onSubmit")(values)} />
);

const VIEWPORTS = [
  widthOf(INITIAL_VIEWPORTS.iphonex), // Modern iPhone
  heightOf(INITIAL_VIEWPORTS.ipad12p), // Most common viewport size that falls within chromatic range
];

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: VIEWPORTS },
};
