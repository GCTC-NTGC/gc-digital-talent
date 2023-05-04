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
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1, 0)"
    >
      <Well>
        <p>Default: {content}</p>
      </Well>
      <Well color="success">
        <p>Success: {content}</p>
      </Well>
      <Well color="warning">
        <p>Warning: {content}</p>
      </Well>
      <Well color="error">
        <p>Error: {content}</p>
      </Well>
    </div>
  );
};

export const Default = Template.bind({});
