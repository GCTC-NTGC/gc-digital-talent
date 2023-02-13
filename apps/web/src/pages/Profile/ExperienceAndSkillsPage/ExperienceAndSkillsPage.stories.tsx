import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { fakeSkills, fakeExperiences } from "@gc-digital-talent/fake-data";
import { notEmpty } from "@gc-digital-talent/helpers";
import { ExperienceAndSkills } from "./components/ExperienceAndSkills";

export default {
  title: "Pages/Experience and Skills Page",
  args: {
    applicantId: "test",
  },
} as ComponentMeta<typeof ExperienceAndSkills>;

const Template: ComponentStory<typeof ExperienceAndSkills> = (args) => {
  return <ExperienceAndSkills {...args} />;
};

export const NoExperiences = Template.bind({});
export const WithExperiences = Template.bind({});
export const NoExperiencesMissingSkills = Template.bind({});
export const WithExperiencesMissingSkills = Template.bind({});

const mockExperiences = fakeExperiences(10);
const mockExperienceSkills = mockExperiences
  .map((experience) => {
    return experience.skills;
  })
  .filter(notEmpty)
  .flatMap((skill) => skill);

const mockSkills = [...fakeSkills(20), ...mockExperienceSkills];

const mockRequiredSkills = mockSkills.slice(0, 5);
const mockOptionalSkills = mockSkills.slice(6, 10);

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
