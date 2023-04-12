import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { fakePoolCandidates } from "@gc-digital-talent/fake-data";
import { ApplicationResumeIntroduction } from "./ApplicationResumeIntroductionPage";

const fakeApplication = fakePoolCandidates()[0];

export default {
  component: ApplicationResumeIntroduction,
  title: "Application/Resume Introduction",
  args: {
    application: fakeApplication,
  },
} as ComponentMeta<typeof ApplicationResumeIntroduction>;

const Template: ComponentStory<typeof ApplicationResumeIntroduction> = (
  args,
) => {
  return <ApplicationResumeIntroduction {...args} />;
};

export const Default = Template.bind({});
