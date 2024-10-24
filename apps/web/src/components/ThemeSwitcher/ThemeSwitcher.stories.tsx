import { Meta, StoryFn } from "@storybook/react";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import ThemeSwitcher from "./ThemeSwitcher";

export default {
  component: ThemeSwitcher,
  decorators: [OverlayOrDialogDecorator],
} as Meta;

const Template: StoryFn<typeof ThemeSwitcher> = () => <ThemeSwitcher />;

export const Default = Template.bind({});
