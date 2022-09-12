import React from "react";
import { Story, Meta } from "@storybook/react";
import Card from "./Card";

export default {
  component: Card,
  title: "Components/Card",
} as Meta;

const Spacer: React.FC = ({ children }) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-align-items="base(center)"
    style={{ padding: "1rem" }}
  >
    {children}
  </div>
);

const Template: Story = () => (
  <div
    data-h2-display="base(flex)"
    data-h2-justify-content="base(space-around)"
    style={{ margin: "-1rem" }}
  >
    <Spacer>
      <Card title="TS Primary">
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </Card>
    </Spacer>
    <Spacer>
      <Card title="TS Secondary" color="ts-secondary">
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </Card>
    </Spacer>
    <Spacer>
      <Card title="IA Primary" color="ia-primary">
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </Card>
    </Spacer>
    <Spacer>
      <Card title="IA Secondary" color="ia-secondary">
        <p>Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.</p>
      </Card>
    </Spacer>
  </div>
);

export const CardStory = Template.bind({});
