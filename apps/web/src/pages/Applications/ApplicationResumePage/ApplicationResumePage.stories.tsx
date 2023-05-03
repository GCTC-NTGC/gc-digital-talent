import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  fakeExperiences,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";

import { ApplicationResume } from "./ApplicationResumePage";
import { ApplicationPageProps } from "../ApplicationApi";

const fakePoolCandidate = fakePoolCandidates(1)[0];
const fakeUser = fakePoolCandidate.user;

const noExperiencesProps: ApplicationPageProps = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: [],
    },
  },
};

const hasExperiencesProps: ApplicationPageProps = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: fakeExperiences(5),
    },
  },
};

export default {
  component: ApplicationResume,
  title: "Pages/Application Revamp/Review Resume",
} as ComponentMeta<typeof ApplicationResume>;

const Template: ComponentStory<typeof ApplicationResume> = (props) => (
  <ApplicationResume {...props} />
);

export const NoExperiences = Template.bind({});
NoExperiences.args = noExperiencesProps;

export const HasExperiences = Template.bind({});
HasExperiences.args = hasExperiencesProps;
