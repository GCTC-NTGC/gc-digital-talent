import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { faker } from "@faker-js/faker";
import {
  AcademicCapIcon,
  BanknotesIcon,
  CakeIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

import Stepper from "./Stepper";
import { StepType } from "./types";

export default {
  component: Stepper,
  title: "Components/Stepper",
} as ComponentMeta<typeof Stepper>;

faker.seed(0);
const defaultSteps: Array<StepType> = [
  {
    href: "#step-one",
    label: faker.lorem.words(1),
    icon: AcademicCapIcon,
    completed: true,
  },
  {
    href: "#step-two",
    label: faker.lorem.words(1),
    icon: BanknotesIcon,
    error: true,
  },
  {
    href: "#step-three",
    label: faker.lorem.words(1),
    icon: CakeIcon,
    completed: true,
  },
  {
    href: "#step-three",
    label: faker.lorem.words(1),
    icon: DevicePhoneMobileIcon,
    completed: true,
  },
  {
    href: "#step-four",
    label: faker.lorem.words(1),
    icon: EnvelopeIcon,
    completed: true,
  },
];

const Template: ComponentStory<typeof Stepper> = (args) => {
  const { label, steps, currentIndex } = args;

  return <Stepper steps={steps} label={label} currentIndex={currentIndex} />;
};

export const Default = Template.bind({});
Default.args = {
  label: "Default Stepper",
  steps: defaultSteps,
};
