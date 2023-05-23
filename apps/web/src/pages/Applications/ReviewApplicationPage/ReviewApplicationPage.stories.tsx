import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  fakeExperiences,
  fakePoolCandidates,
  fakeSkills,
} from "@gc-digital-talent/fake-data";

import { Experience } from "~/api/generated";
import { ReviewApplication } from "./ReviewApplicationPage";

const poolCandidate = fakePoolCandidates(1)[0];
const { pool } = poolCandidate;
const applicant = poolCandidate.user;
const essentialSkills = fakeSkills(1);
const newExperience = fakeExperiences(1)[0] as Experience;
newExperience.skills = essentialSkills;

export default {
  component: ReviewApplication,
  title: "Pages/Review Application",
  args: {
    poolAdvertisement: pool,
    applicant,
    applicationId: poolCandidate.id,
    closingDate: poolCandidate.pool.closingDate,
  },
} as ComponentMeta<typeof ReviewApplication>;

const Template: ComponentStory<typeof ReviewApplication> = (args) => {
  return <ReviewApplication {...args} />;
};

export const ApplicationIsIncomplete = Template.bind({});
export const ApplicationIsComplete = Template.bind({});

ApplicationIsComplete.args = {
  poolAdvertisement: {
    ...pool,
    essentialSkills,
  },
  applicant: {
    ...applicant,
    experiences: [newExperience],
    isProfileComplete: true,
  },
};
