import React from "react";
import type { Meta, StoryFn } from "@storybook/react";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import ThemeSwitcher from "./ThemeSwitcher";

type ComponentType = typeof ThemeSwitcher;
type Meta = Meta<ComponentType>;
type Story = StoryFn<ComponentType>;

export default {
  component: ThemeSwitcher,
  title: "Components/ThemeSwitcher",
  decorators: [OverlayOrDialogDecorator],
} as Meta;

const Template: Story = () => (
  <div
    data-h2-background-color="base(white) base:dark(black)"
    data-h2-padding="base(x1)"
    data-h2-height="base(100%)"
    data-h2-width="base(100%)"
  >
    <ThemeSwitcher />
  </div>
);

export const Default = Template.bind({});
