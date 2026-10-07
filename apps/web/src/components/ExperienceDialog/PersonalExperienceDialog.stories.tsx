import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  experienceGenerators,
  fakeUserSkills,
} from "@gc-digital-talent/fake-data";
import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import PersonalExperienceDialog from "./PersonalExperienceDialog";

faker.seed(0);

export default {
  component: PersonalExperienceDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
    trigger: <Button>Open dialog</Button>,
  },
};

const Template: StoryFn<typeof PersonalExperienceDialog> = (args) => (
  <PersonalExperienceDialog {...args} />
);

const experience = experienceGenerators.personalExperiences()[0];

const skills = experience.skills ?? [];
const mockUserSkills = fakeUserSkills(skills.length);
const userSkills = skills.map((skill, index) => ({
  skillId: skill.id,
  skillLevel: mockUserSkills[index]?.skillLevel,
}));

export const Default = Template.bind({});
Default.args = {
  experience,
  userSkills,
};

export const MissingInfo = Template.bind({});
MissingInfo.args = {
  experience: {
    ...experience,
    learningDescription: null,
  },
  userSkills,
};
