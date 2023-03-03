import React from "react";
import { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Card from "./Card";

export default {
  component: Card,
  title: "Components/Card",
} as Meta;

const Template: Story = () => {
  faker.seed(0);
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-padding="base(x2)"
      data-h2-grid-template-columns="base(repeat(5, minmax(0, 1fr)))"
      data-h2-gap="base(x2)"
    >
      <Card title="Primary">
        <p>{faker.lorem.sentences(1)}</p>
      </Card>
      <Card title="Secondary" color="secondary">
        <p>{faker.lorem.sentences(1)}</p>
      </Card>
      <Card title="Tertiary" color="tertiary">
        <p>{faker.lorem.sentences(1)}</p>
      </Card>
      <Card title="Quaternary" color="quaternary">
        <p>{faker.lorem.sentences(1)}</p>
      </Card>
      <Card title="Quinary" color="quinary">
        <p>{faker.lorem.sentences(1)}</p>
      </Card>
    </div>
  );
};

export const CardStory = Template.bind({});
