import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import {
  fakeExperiences,
  fakePoolCandidates,
} from "@gc-digital-talent/fake-data";

import { notEmpty } from "@gc-digital-talent/helpers";
import { ApplicationSkills } from "./ApplicationSkillsPage";
import { ApplicationPageProps } from "../ApplicationApi";

const fakePoolCandidate = fakePoolCandidates(1)[0];
const fakeUser = fakePoolCandidate.user;
const mockExperiences = fakeExperiences(5);
const mockPoolAdvertisementSkills =
  fakePoolCandidate?.poolAdvertisement?.essentialSkills?.filter(notEmpty);
const experienceSkills = mockExperiences
  .filter(notEmpty)
  .map((experience) => experience.skills)
  .filter(notEmpty)
  .flatMap((skill) => skill);

const noSkills: ApplicationPageProps = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: mockExperiences,
    },
  },
};

const hasExperiencesProps: ApplicationPageProps = {
  application: {
    ...fakePoolCandidate,
    user: {
      ...fakeUser,
      experiences: mockExperiences,
    },
    poolAdvertisement: fakePoolCandidate.poolAdvertisement
      ? {
          ...fakePoolCandidate.poolAdvertisement,
          essentialSkills: [
            ...(mockPoolAdvertisementSkills || []),
            ...experienceSkills,
          ],
        }
      : undefined,
  },
};

export default {
  component: ApplicationSkills,
  title: "Pages/Application Revamp/Skill Requirements",
} as ComponentMeta<typeof ApplicationSkills>;

const Template: ComponentStory<typeof ApplicationSkills> = (props) => (
  <ApplicationSkills {...props} />
);

export const NoSkills = Template.bind({});
NoSkills.args = noSkills;

export const HasExperiences = Template.bind({});
HasExperiences.args = hasExperiencesProps;
