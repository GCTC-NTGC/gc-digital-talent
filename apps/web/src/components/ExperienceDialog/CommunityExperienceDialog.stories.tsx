import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  experienceGenerators,
  fakeUserSkills,
} from "@gc-digital-talent/fake-data";
import { makeFragmentData } from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import CommunityExperienceDialog, {
  CommunityExperienceDialog_Fragment,
} from "./CommunityExperienceDialog";

faker.seed(0);

export default {
  component: CommunityExperienceDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
    trigger: <Button>Open dialog</Button>,
  },
};

const Template: StoryFn<typeof CommunityExperienceDialog> = (args) => (
  <CommunityExperienceDialog {...args} />
);

const experience = experienceGenerators.communityExperiences()[0];

const skills = experience.skills ?? [];
const mockUserSkills = fakeUserSkills(skills.length);
const userSkills = skills.map((skill, index) => ({
  skillId: skill.id,
  skillLevel: mockUserSkills[index]?.skillLevel,
}));

export const Default = Template.bind({});
Default.args = {
  experienceQuery: makeFragmentData(
    experience,
    CommunityExperienceDialog_Fragment,
  ),
  userSkills,
};

export const MissingInfo = Template.bind({});
MissingInfo.args = {
  experienceQuery: makeFragmentData(
    {
      ...experience,
      project: null,
    },
    CommunityExperienceDialog_Fragment,
  ),
  userSkills,
};
