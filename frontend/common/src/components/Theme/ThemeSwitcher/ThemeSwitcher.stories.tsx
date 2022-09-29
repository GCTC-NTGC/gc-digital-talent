import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import ThemeDecorator from "../../../../.storybook/decorators/ThemeDecorator";

import ThemeSwitcher from "./ThemeSwitcher";

type ComponentType = typeof ThemeSwitcher;
type Meta = ComponentMeta<ComponentType>;
type Story = ComponentStory<ComponentType>;

export default {
  component: ThemeSwitcher,
  title: "Components/ThemeSwitcher",
  decorators: [ThemeDecorator],
} as Meta;

const Template: Story = () => <ThemeSwitcher />;

export const Default = Template.bind({});
