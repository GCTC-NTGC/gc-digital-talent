import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { faker } from "@faker-js/faker";

import {
  FAR_FUTURE_DATE,
  FAR_PAST_DATE,
} from "@gc-digital-talent/date-helpers";

import ApplicationPageWrapper from "./ApplicationPageWrapper";

type ApplicationPageWrapperComponent = typeof ApplicationPageWrapper;

export default {
  component: ApplicationPageWrapper,
  title: "Components/Application Page Wrapper",
} as ComponentMeta<ApplicationPageWrapperComponent>;

const Template: ComponentStory<ApplicationPageWrapperComponent> = (args) => {
  faker.seed(0);
  return (
    <ApplicationPageWrapper {...args}>
      <p>{faker.lorem.sentences(10)}</p>
      <p>{faker.lorem.sentences(10)}</p>
      <p>{faker.lorem.sentences(10)}</p>
      <p>{faker.lorem.sentences(10)}</p>
      <p>{faker.lorem.sentences(10)}</p>
    </ApplicationPageWrapper>
  );
};

export const BasicApplicationPageWrapper = Template.bind({});
BasicApplicationPageWrapper.args = {
  title: "Basic Application Page Wrapper",
  subtitle: "Subtitle for Page Wrapper",
  closingDate: FAR_FUTURE_DATE,
  crumbs: [
    { label: "Pool Name", url: "#pool" },
    { label: "About Me", url: "#about" },
  ],
  navigation: {
    currentStep: 1,
    steps: [
      {
        path: "#step-one",
        label: "Step One",
      },
      {
        path: "#step-two",
        label: "Step Two",
      },
    ],
  },
};

export const NoNavigationApplicationPageWrapper = Template.bind({});
NoNavigationApplicationPageWrapper.args = {
  title: "Basic Application Page Wrapper",
  subtitle: "Subtitle for Page Wrapper",
  closingDate: FAR_FUTURE_DATE,
  crumbs: [
    { label: "Pool Name", url: "#pool" },
    { label: "About Me", url: "#about" },
  ],
};

export const ExpiredApplicationPageWrapper = Template.bind({});
ExpiredApplicationPageWrapper.args = {
  title: "Basic Application Page Wrapper",
  subtitle: "Subtitle for Page Wrapper",
  closingDate: FAR_PAST_DATE,
  crumbs: [
    { label: "Pool Name", url: "#pool" },
    { label: "About Me", url: "#about" },
  ],
};
