import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  fakeExperiences,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";

import { ExperienceForDate } from "~/types/experience";

import { ApplicationResume } from "./ApplicationResumePage";

const fakePoolCandidate = fakePoolCandidates(1)[0];
const fakeUser = fakePoolCandidate.user;

type ApplicationResumeStory = ComponentStory<typeof ApplicationResume>;

const noExperiencesProps: ApplicationResumeStory["args"] = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: [],
    },
  },
  experiences: [],
};

const hasExperiencesProps: ApplicationResumeStory["args"] = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: fakeExperiences(5),
    },
  },
  experiences: fakeExperiences(5) as Array<ExperienceForDate>,
};

export default {
  component: ApplicationResume,
  title: "Pages/Application/Review Resume",
} as ComponentMeta<typeof ApplicationResume>;

const Template: ApplicationResumeStory = (props) => (
  <ApplicationResume {...props} />
);

export const NoExperiences = Template.bind({});
NoExperiences.args = noExperiencesProps;

export const HasExperiences = Template.bind({});
HasExperiences.args = hasExperiencesProps;
