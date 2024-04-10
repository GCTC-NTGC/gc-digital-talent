import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import ThemeSwitcher from "./ThemeSwitcher";

type ComponentType = typeof ThemeSwitcher;
type Meta = ComponentMeta<ComponentType>;
type Story = ComponentStory<ComponentType>;

export default {
  component: ThemeSwitcher,
  title: "Components/ThemeSwitcher",
  decorators: [OverlayOrDialogDecorator],
  parameters: {
    chromatic: { delay: 300 },
  },
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
