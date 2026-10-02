import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import { experienceGenerators } from "@gc-digital-talent/fake-data";
import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import WorkExperienceDialog from "./WorkExperienceDialog";

faker.seed(0);

export default {
  component: WorkExperienceDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
    trigger: <Button>Open dialog</Button>,
  },
};

const Template: StoryFn<typeof WorkExperienceDialog> = (args) => (
  <WorkExperienceDialog {...args} />
);

export const Default = Template.bind({});
Default.args = {
  experience: experienceGenerators.workExperiences()[0],
};
