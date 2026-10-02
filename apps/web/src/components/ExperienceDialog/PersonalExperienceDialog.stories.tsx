import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import { experienceGenerators } from "@gc-digital-talent/fake-data";
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

export const Default = Template.bind({});
Default.args = {
  experience: experienceGenerators.personalExperiences()[0],
};
