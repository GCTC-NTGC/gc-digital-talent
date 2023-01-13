import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  fakeExperiences,
  fakePoolCandidates,
  fakeSkills,
} from "@common/fakeData";

import { Experience } from "~/api/generated";
import ReviewApplicationPage from "./ReviewApplicationPage";

const poolCandidate = fakePoolCandidates(1)[0];
const { poolAdvertisement } = poolCandidate;
const applicant = poolCandidate.user;
const essentialSkills = fakeSkills(1);
const newExperience = fakeExperiences(1)[0] as Experience;
newExperience.skills = essentialSkills;

export default {
  component: ReviewApplicationPage,
  title: "Pages/Review Application",
  args: {
    poolAdvertisement,
    applicant,
    applicationId: poolCandidate.id,
    closingDate: poolCandidate.poolAdvertisement?.closingDate,
  },
} as ComponentMeta<typeof ReviewApplicationPage>;

const Template: ComponentStory<typeof ReviewApplicationPage> = (args) => {
  return <ReviewApplicationPage {...args} />;
};

export const ApplicationIsIncomplete = Template.bind({});
export const ApplicationIsComplete = Template.bind({});

ApplicationIsComplete.args = {
  poolAdvertisement: {
    ...poolAdvertisement,
    id: poolAdvertisement?.id || "1",
    essentialSkills,
  },
  applicant: {
    ...applicant,
    experiences: [newExperience],
    isProfileComplete: true,
  },
};
