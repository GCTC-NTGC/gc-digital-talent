import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
  fakePoolCandidates,
  fakeExperiences,
} from "@gc-digital-talent/fake-data";
import { notEmpty } from "@gc-digital-talent/helpers";
import { makeFragmentData } from "@gc-digital-talent/graphql";

import { ApplicationSkills } from "./ApplicationSkillsPage";
import { Application_PoolCandidateFragment } from "../ApplicationApi";
import { Application_UserExperiencesFragment } from "../operations";

const fakePoolCandidate = fakePoolCandidates(1)[0];
const fakeUser = fakePoolCandidate.user;
const mockExperiences = fakeExperiences(5);
const experienceSkills = mockExperiences
  .filter(notEmpty)
  .map((experience) => experience.skills)
  .filter(notEmpty)
  .flatMap((skill) => skill);

const mockExperiencesFragment = makeFragmentData(
  {
    ...fakeUser,
    experiences: mockExperiences,
  },
  Application_UserExperiencesFragment,
);

export default {
  component: ApplicationSkills,
  title: "Pages/Application/Skill Requirements",
} as Meta<typeof ApplicationSkills>;

const Template: StoryFn<typeof ApplicationSkills> = (props) => (
  <ApplicationSkills {...props} />
);

export const NoSkills = Template.bind({});
NoSkills.args = {
  query: makeFragmentData(
    {
      ...fakePoolCandidate,
      user: {
        ...fakeUser,
        experiences: mockExperiences,
      },
    },
    Application_PoolCandidateFragment,
  ),
  experiencesQuery: mockExperiencesFragment,
};

export const HasExperiences = Template.bind({});
HasExperiences.args = {
  query: makeFragmentData(
    {
      ...fakePoolCandidate,
      user: {
        ...fakeUser,
        experiences: mockExperiences,
      },
      pool: {
        ...fakePoolCandidate.pool,
        essentialSkills: [...experienceSkills],
      },
    },
    Application_PoolCandidateFragment,
  ),
  experiencesQuery: mockExperiencesFragment,
};
