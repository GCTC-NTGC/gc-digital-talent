import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  experienceGenerators,
  fakeUserSkills,
} from "@gc-digital-talent/fake-data";
import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import AwardExperienceDialog from "./AwardExperienceDialog";

faker.seed(0);

export default {
  component: AwardExperienceDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
    trigger: <Button>Open dialog</Button>,
  },
};

const Template: StoryFn<typeof AwardExperienceDialog> = (args) => (
  <AwardExperienceDialog {...args} />
);

const experience = {
  ...experienceGenerators.awardExperiences()[0],
  relatedExperience: experienceGenerators.workExperiences()[0],
};

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
