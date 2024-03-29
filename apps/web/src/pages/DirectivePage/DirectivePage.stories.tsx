import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { CHROMATIC_VIEWPORTS } from "@gc-digital-talent/storybook-helpers";

import DirectivePage from "./DirectivePage";

type Meta = ComponentMeta<typeof DirectivePage>;
type Story = ComponentStory<typeof DirectivePage>;

export default {
  component: DirectivePage,
  title: "Pages/Directive on Digital Talent",
} as Meta;

const Template: Story = () => <DirectivePage />;

export const Default = Template.bind({});
Default.parameters = {
  chromatic: { viewports: CHROMATIC_VIEWPORTS },
};
