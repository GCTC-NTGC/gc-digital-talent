import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import { experienceGenerators } from "@gc-digital-talent/fake-data";
import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import CommunityExperienceDialog from "./CommunityExperienceDialog";

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

export const Default = Template.bind({});
Default.args = {
  experience: experienceGenerators.communityExperiences()[0],
};
