import React from "react";
import { StoryFn } from "@storybook/react";

import {
  fakeExperiences,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { ApplicationCareerTimeline } from "./ApplicationCareerTimelinePage";
import { Application_PoolCandidateFragment } from "../ApplicationApi";
import { Application_UserExperiencesFragment } from "../operations";

const mockPoolCandidate = fakePoolCandidates(1)[0];
const mockExperiences = fakeExperiences(5);
const mockUser = {
  ...mockPoolCandidate.user,
  experiences: mockExperiences,
};
const mockPoolCandidateFragment = makeFragmentData(
  mockPoolCandidate,
  Application_PoolCandidateFragment,
);
const mockExperiencesFragment = makeFragmentData(
  mockUser,
  Application_UserExperiencesFragment,
);

export default {
  component: ApplicationCareerTimeline,
  title: "Pages/Application/Review Career Timeline",
};

const Template: StoryFn<typeof ApplicationCareerTimeline> = (props) => (
  <ApplicationCareerTimeline {...props} />
);

export const NoExperiences = Template.bind({});
NoExperiences.args = {
  query: mockPoolCandidateFragment,
  experiencesQuery: makeFragmentData(
    {
      ...mockUser,
      experiences: [],
    },
    Application_UserExperiencesFragment,
  ),
};

export const HasExperiences = Template.bind({});
HasExperiences.args = {
  query: mockPoolCandidateFragment,
  experiencesQuery: mockExperiencesFragment,
};
