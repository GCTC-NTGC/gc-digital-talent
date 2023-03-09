import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import Stepper from "./Stepper";
import { defaultSteps } from "./testUtils";

export default {
  component: Stepper,
  title: "Components/Stepper",
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => {
  const { label, steps, currentIndex } = args;

  return <Stepper steps={steps} label={label} currentIndex={currentIndex} />;
};

export const Default = Template.bind({});
Default.args = {
  label: "Default Stepper",
  steps: defaultSteps,
  currentIndex: 2,
};
