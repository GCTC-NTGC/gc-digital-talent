import type { Meta, StoryObj } from "@storybook/react";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import ThemeSwitcher from "./ThemeSwitcher";

const meta = {
  component: ThemeSwitcher,
  decorators: [OverlayOrDialogDecorator],
} satisfies Meta<typeof ThemeSwitcher>;
export default meta;

type Story = StoryObj<typeof ThemeSwitcher>;

export const Default: Story = {};
