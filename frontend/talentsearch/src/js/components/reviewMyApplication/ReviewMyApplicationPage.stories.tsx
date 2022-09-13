import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  fakeExperiences,
  fakePoolCandidates,
  fakeSkills,
} from "@common/fakeData";
import { ReviewMyApplication } from "./ReviewMyApplicationPage";
import { Experience } from "../../api/generated";

const poolCandidate = fakePoolCandidates(1)[0];
const { poolAdvertisement } = poolCandidate;
const applicant = poolCandidate.user;
const essentialSkills = fakeSkills(1);
const newExperience = fakeExperiences(1)[0] as Experience;
newExperience.skills = essentialSkills;

export default {
  component: ReviewMyApplication,
  title: "Review My Application",
  args: {
    poolAdvertisement,
    applicant,
    applicationId: poolCandidate.id,
    closingDate: poolCandidate.poolAdvertisement?.expiryDate,
  },
} as ComponentMeta<typeof ReviewMyApplication>;

const Template: ComponentStory<typeof ReviewMyApplication> = (args) => {
  return <ReviewMyApplication {...args} />;
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
