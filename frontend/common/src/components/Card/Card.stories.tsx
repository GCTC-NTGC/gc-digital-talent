import React from "react";
import { Story, Meta } from "@storybook/react";
import Card from "./Card";

export default {
  component: Card,
  title: "Components/Card",
  args: {
    title: "Card Title",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sed purus tristique, finibus nisi sit amet, lacinia elit. Nam vitae tellus condimentum, iaculis mauris pellentesque, venenatis ipsum.",
  },
} as Meta;

const Spacer: React.FC = ({ children }) => (
  <div
    data-h2-display="b(flex)"
    data-h2-flex-direction="b(column)"
    data-h2-align-items="b(center)"
    style={{ padding: "1rem" }}
  >
    {children}
  </div>
);

const Template: Story = (args) => {
  const { title, content } = args;

  return (
    <div
      data-h2-display="b(flex)"
      data-h2-justify-content="b(space-around)"
      style={{ margin: "-1rem" }}
    >
      <Spacer>
        <Card title="TS Primary">
          <p>
            Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.
          </p>
        </Card>
      </Spacer>
      <Spacer>
        <Card title="TS Secondary" color="ts-secondary">
          <p>
            Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.
          </p>
        </Card>
      </Spacer>
      <Spacer>
        <Card title="IA Primary" color="ia-primary">
          <p>
            Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.
          </p>
        </Card>
      </Spacer>
      <Spacer>
        <Card title="IA Secondary" color="ia-secondary">
          <p>
            Etiam auctor bibendum lectus, ornare dapibus est placerat vitae.
          </p>
        </Card>
      </Spacer>
    </div>
  );
};

export const CardStory = Template.bind({});
