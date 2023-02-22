import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { OverlayOrDialogDecorator } from "storybook-helpers";
import { fakeSkills, fakeExperiences } from "@gc-digital-talent/fake-data";
import { notEmpty } from "@gc-digital-talent/helpers";

import { ExperienceAndSkills } from "./components/ExperienceAndSkills";
import AddExperienceDialog from "./components/AddExperienceDialog";

export default {
  title: "Pages/Experience and Skills Page",
  args: {
    applicantId: "test",
  },
} as ComponentMeta<typeof ExperienceAndSkills>;

const ExperienceAndSkillsTemplate: ComponentStory<
  typeof ExperienceAndSkills
> = (args) => {
  return <ExperienceAndSkills {...args} />;
};
const AddExperienceDialogTemplate: ComponentStory<
  typeof AddExperienceDialog
> = (args) => {
  return <AddExperienceDialog {...args} />;
};

export const NoExperiences = ExperienceAndSkillsTemplate.bind({});
export const WithExperiences = ExperienceAndSkillsTemplate.bind({});
export const NoExperiencesMissingSkills = ExperienceAndSkillsTemplate.bind({});
export const WithExperiencesMissingSkills = ExperienceAndSkillsTemplate.bind(
  {},
);
export const AddExperienceDialogOpen = AddExperienceDialogTemplate.bind({});

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

AddExperienceDialogOpen.decorators = [OverlayOrDialogDecorator];
AddExperienceDialogOpen.args = {
  defaultOpen: true,
};
