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
      <CardFlat title="Primary" color="primary">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat title="Secondary" color="secondary">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat title="Tertiary" color="tertiary">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat title="Quaternary" color="quaternary">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat title="Quinary" color="quinary">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat title="Black" color="black">
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat
        title="Link"
        color="primary"
        links={[{ href: "#", label: "With link" }]}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
      <CardFlat
        title="Two Links"
        color="primary"
        links={[
          { href: "#", label: "With link", mode: "solid" },
          { href: "#", label: "Second link", mode: "inline" },
        ]}
      >
        <p>{faker.lorem.sentences(1)}</p>
      </CardFlat>
    </div>
  );
};

export const CardFlatStory = Template.bind({});
