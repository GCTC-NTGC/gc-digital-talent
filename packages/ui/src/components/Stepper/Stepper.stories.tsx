import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ComponentStory, ComponentMeta, DecoratorFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Stepper from "./Stepper";
import { defaultSteps } from "./testUtils";
import { StepType } from "./types";

const ReactRouterDecorator: DecoratorFn = (Story, options) => {
  const { args } = options;
  const location = useLocation();
  useEffect(() => {
    action("location")(location);
  }, [location]);

  const currentIndex = args.steps.findIndex(
    (step: StepType) => step.href === location.pathname,
  );

  return (
    <Story
      args={{
        ...args,
        currentIndex: currentIndex >= 0 ? currentIndex : 0,
      }}
    />
  );
};

export default {
  component: Stepper,
  title: "Components/Stepper",
  decorators: [ReactRouterDecorator],
} as ComponentMeta<typeof Stepper>;

const Template: ComponentStory<typeof Stepper> = (args) => {
  const { label, steps, currentIndex, preventDisable } = args;

  return (
    <div data-h2-max-width="base(18rem)">
      <Stepper
        preventDisable={preventDisable}
        steps={steps}
        label={label}
        currentIndex={currentIndex}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Default Stepper",
  steps: defaultSteps,
  currentIndex: 2,
  preventDisable: true,
};
