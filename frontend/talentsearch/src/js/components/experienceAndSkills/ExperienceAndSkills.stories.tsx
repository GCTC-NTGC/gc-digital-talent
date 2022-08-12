import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { fakeSkills, fakeExperiences } from "@common/fakeData";
import { flatten, notEmpty } from "@common/helpers/util";
import { ExperienceAndSkills } from "./ExperienceAndSkills";

export default {
  component: ExperienceAndSkills,
  title: "ApplicantProfile/ExperienceAndSkillsPage",
} as ComponentMeta<typeof ExperienceAndSkills>;

const Template: ComponentStory<typeof ExperienceAndSkills> = (args) => {
  return <ExperienceAndSkills {...args} />;
};

export const NoExperiences = Template.bind({});
export const WithExperiences = Template.bind({});
export const NoExperiencesMissingSkills = Template.bind({});
export const WithExperiencesMissingSkills = Template.bind({});

const mockExperiences = fakeExperiences(10);
const mockExperienceSkills = flatten(
  mockExperiences
    .map((experience) => {
      return experience.skills;
    })
    .filter(notEmpty),
);

const mockSkills = [...fakeSkills(20), ...mockExperienceSkills];

function getRandom<T>(items: T[], n: number) {
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const mockRequiredSkills = getRandom(mockSkills, 5);
const mockOptionalSkills = getRandom(mockSkills, 5);

NoExperiences.args = {
  experiences: [],
};

WithExperiences.args = {
  experiences: mockExperiences,
};

NoExperiencesMissingSkills.args = {
  experiences: [],
  missingSkills: {
    requiredSkills: mockRequiredSkills,
    optionalSkills: mockOptionalSkills,
  },
};

WithExperiencesMissingSkills.args = {
  experiences: mockExperiences,
  missingSkills: {
    requiredSkills: mockRequiredSkills,
    optionalSkills: mockOptionalSkills,
  },
};
