import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import {
  fakePoolCandidates,
  fakeExperienceForDate,
} from "@gc-digital-talent/fake-data";

import { notEmpty } from "@gc-digital-talent/helpers";
import {
  ApplicationSkills,
  ApplicationSkillsProps,
} from "./ApplicationSkillsPage";

const fakePoolCandidate = fakePoolCandidates(1)[0];
const fakeUser = fakePoolCandidate.user;
const mockExperiences = fakeExperienceForDate(5);
const experienceSkills = mockExperiences
  .filter(notEmpty)
  .map((experience) => experience.skills)
  .filter(notEmpty)
  .flatMap((skill) => skill);

const noSkills: ApplicationSkillsProps = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: mockExperiences,
    },
  },
  experiences: mockExperiences,
};

const hasExperiencesProps: ApplicationSkillsProps = {
  application: {
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
  experiences: mockExperiences,
};

export default {
  component: ApplicationSkills,
  title: "Pages/Application/Skill Requirements",
} as Meta<typeof ApplicationSkills>;

const Template: StoryFn<typeof ApplicationSkills> = (props) => (
  <ApplicationSkills {...props} />
);

export const NoSkills = Template.bind({});
NoSkills.args = noSkills;

export const HasExperiences = Template.bind({});
HasExperiences.args = hasExperiencesProps;
