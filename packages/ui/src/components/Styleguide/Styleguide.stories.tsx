import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Styleguide from "./Styleguide";

type ComponentType = typeof Styleguide;
type Meta = ComponentMeta<ComponentType>;
type Story = ComponentStory<ComponentType>;

faker.seed(0);

export default {
  component: Styleguide,
  title: "Components/Styleguide",
  args: {
    content: faker.lorem.sentences(2),
  },
} as Meta;

const Template: Story = (args) => {
  const { content } = args;
  return (
    <div>
      <Styleguide>{content}</Styleguide>
    </div>
  );
};

export const Default = Template.bind({});
