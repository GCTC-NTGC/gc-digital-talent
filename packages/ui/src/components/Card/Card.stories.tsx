import React from "react";
import { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Card from "./Card";

export default {
  component: Card,
  title: "Components/Card",
} as Meta;

interface SpacerProps {
  children: React.ReactNode;
}

const Spacer = ({ children }: SpacerProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-align-items="base(center)"
    style={{ padding: "1rem" }}
  >
    {children}
  </div>
);

const Template: Story = () => {
  faker.seed(0);
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-justify-content="base(space-around)"
      style={{ margin: "-1rem" }}
    >
      <Spacer>
        <Card title="TS Primary">
          <p>{faker.lorem.sentences(1)}</p>
        </Card>
      </Spacer>
      <Spacer>
        <Card title="TS Secondary" color="ts-secondary">
          <p>{faker.lorem.sentences(1)}</p>
        </Card>
      </Spacer>
      <Spacer>
        <Card title="IA Primary" color="ia-primary">
          <p>{faker.lorem.sentences(1)}</p>
        </Card>
      </Spacer>
      <Spacer>
        <Card title="IA Secondary" color="ia-secondary">
          <p>{faker.lorem.sentences(1)}</p>
        </Card>
      </Spacer>
    </div>
  );
};

export const CardStory = Template.bind({});
