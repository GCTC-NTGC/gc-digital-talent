import { useEffect } from "react";
import { useLocation } from "react-router";
import type { Args, Decorator } from "@storybook/react-vite";
import { StoryFn, Meta } from "@storybook/react-vite";
import { action } from "storybook/actions";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

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

interface StoryArgs {
  steps: StepType[];
}

const ReactRouterDecorator: Decorator<StoryArgs & Args> = (Story, options) => {
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
  decorators: [ReactRouterDecorator],
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta<typeof Stepper>;

const Template: StoryFn<typeof Stepper> = (args) => {
  const { label, steps, currentIndex } = args;

  return (
    <div className="max-w-72">
      <Stepper steps={steps} label={label} currentIndex={currentIndex} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Default Stepper",
  steps: longLabelSteps,
  currentIndex: 2,
};
