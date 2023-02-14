import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Well from "./Well";

type ComponentType = typeof Well;
type Meta = ComponentMeta<ComponentType>;
type Story = ComponentStory<ComponentType>;

faker.seed(0);

export default {
  component: Well,
  title: "Components/Well",
  args: {
    content: faker.lorem.sentences(2),
  },
} as Meta;

const Template: Story = (args) => {
  const { content } = args;
  return (
    <Well>
      <p>{content}</p>
    </Well>
  );
};

export const Default = Template.bind({});
