import type { StoryFn } from "@storybook/react-vite";

import { Button } from "@gc-digital-talent/ui";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import AddExperienceDialog from "./AddExperienceDialog";

export default {
  component: AddExperienceDialog,
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
    trigger: <Button>Open dialog</Button>,
  },
};

const Template: StoryFn<typeof AddExperienceDialog> = (args) => (
  <AddExperienceDialog {...args} />
);

export const Default = Template.bind({});
