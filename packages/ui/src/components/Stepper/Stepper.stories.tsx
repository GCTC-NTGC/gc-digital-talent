import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { StoryFn, Meta, DecoratorFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import Stepper from "./Stepper";
import { defaultSteps } from "./testUtils";
import { StepType } from "./types";

faker.seed(0);

const longLabelSteps = defaultSteps.map((step, index) => {
  return index === 3
    ? {
        ...step,
        label: faker.lorem.words(20),
      }
    : step;
});

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
} as Meta<typeof Stepper>;

const Template: StoryFn<typeof Stepper> = (args) => {
  const { label, steps, currentIndex } = args;

  return (
    <div data-h2-max-width="base(18rem)">
      <Stepper steps={steps} label={label} currentIndex={currentIndex} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Default Stepper",
  steps: defaultSteps,
  currentIndex: 2,
};

export const WithLongLabel = Template.bind({});
WithLongLabel.args = {
  label: "Default Stepper",
  steps: longLabelSteps,
  currentIndex: 2,
};
