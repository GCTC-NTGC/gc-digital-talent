import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { OverlayOrDialogDecorator } from "storybook-helpers";
import { fakeSkills, fakeExperiences } from "@gc-digital-talent/fake-data";
import { notEmpty } from "@gc-digital-talent/helpers";

import { CareerTimelineAndRecruitment } from "./components/CareerTimelineAndRecruitment";
import AddExperienceDialog from "./components/AddExperienceDialog";

export default {
  title: "Pages/Career timeline and recruitment",
  args: {
    applicantId: "test",
  },
} as ComponentMeta<typeof CareerTimelineAndRecruitment>;

const CareerTimelineAndRecruitmentTemplate: ComponentStory<
  typeof CareerTimelineAndRecruitment
> = (args) => {
  return <CareerTimelineAndRecruitment {...args} />;
};
const AddExperienceDialogTemplate: ComponentStory<
  typeof AddExperienceDialog
> = (args) => {
  return <AddExperienceDialog {...args} />;
};

export const NoExperiences = CareerTimelineAndRecruitmentTemplate.bind({});
export const WithExperiences = CareerTimelineAndRecruitmentTemplate.bind({});
export const NoExperiencesMissingSkills =
  CareerTimelineAndRecruitmentTemplate.bind({});
export const WithExperiencesMissingSkills =
  CareerTimelineAndRecruitmentTemplate.bind({});
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
