import React from "react";
import { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import CardFlat from "./CardFlat";

export default {
  component: CardFlat,
  title: "Components/Card Flat",
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
        <CardFlat title="Yellow" color="yellow">
          <p>{faker.lorem.sentences(1)}</p>
        </CardFlat>
      </Spacer>
      <Spacer>
        <CardFlat title="Red" color="red">
          <p>{faker.lorem.sentences(1)}</p>
        </CardFlat>
      </Spacer>
      <Spacer>
        <CardFlat title="Blue" color="blue">
          <p>{faker.lorem.sentences(1)}</p>
        </CardFlat>
      </Spacer>
      <Spacer>
        <CardFlat title="Black" color="black">
          <p>{faker.lorem.sentences(1)}</p>
        </CardFlat>
      </Spacer>
      <Spacer>
        <CardFlat
          title="Purple"
          color="purple"
          link={{ href: "#", label: "With link" }}
        >
          <p>{faker.lorem.sentences(1)}</p>
        </CardFlat>
      </Spacer>
    </div>
  );
};

export const CardFlatStory = Template.bind({});
