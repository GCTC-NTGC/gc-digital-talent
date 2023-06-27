import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { OverlayOrDialogDecorator } from "storybook-helpers";
import { fakeSkills, fakeExperiences } from "@gc-digital-talent/fake-data";
import { notEmpty } from "@gc-digital-talent/helpers";

import { ResumeAndRecruitment } from "./components/ResumeAndRecruitment";
import AddExperienceDialog from "./components/AddExperienceDialog";

export default {
  title: "Pages/Résumé and recruitment",
  args: {
    applicantId: "test",
  },
} as ComponentMeta<typeof ResumeAndRecruitment>;

const ResumeAndRecruitmentTemplate: ComponentStory<
  typeof ResumeAndRecruitment
> = (args) => {
  return <ResumeAndRecruitment {...args} />;
};
const AddExperienceDialogTemplate: ComponentStory<
  typeof AddExperienceDialog
> = (args) => {
  return <AddExperienceDialog {...args} />;
};

export const NoExperiences = ResumeAndRecruitmentTemplate.bind({});
export const WithExperiences = ResumeAndRecruitmentTemplate.bind({});
export const NoExperiencesMissingSkills = ResumeAndRecruitmentTemplate.bind({});
export const WithExperiencesMissingSkills = ResumeAndRecruitmentTemplate.bind(
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
