import React from "react";
import { Meta, StoryFn } from "@storybook/react";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import ThemeSwitcher from "./ThemeSwitcher";

export default {
  component: ThemeSwitcher,
  title: "Components/ThemeSwitcher",
  decorators: [OverlayOrDialogDecorator],
} as Meta;

const Template: StoryFn<typeof ThemeSwitcher> = () => (
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
