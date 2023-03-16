import React from "react";
import { Story, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import CardFlat from "./CardFlat";

export default {
  component: CardFlat,
  title: "Components/Card Flat",
} as Meta;

const Template: Story = () => {
  faker.seed(0);
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(repeat(4, minmax(0, 1fr)))"
      data-h2-gap="base(x2)"
    >
      <CardFlat title="Yellow" color="yellow">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat title="Red" color="red">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat title="Blue" color="blue">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat title="Black" color="black">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat
        title="Purple"
        color="purple"
        link={{ href: "#", label: "With link" }}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
    </div>
  );
};

export const CardFlatStory = Template.bind({});
