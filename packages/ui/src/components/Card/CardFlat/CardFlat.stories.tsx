import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CardFlat from "./CardFlat";

faker.seed(0);

export default {
  component: CardFlat,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta;

const Template: StoryFn = () => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1 0)"
  >
    <CardFlat
      title="Primary"
      color="primary"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Secondary"
      color="secondary"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Tertiary"
      color="tertiary"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Quaternary"
      color="quaternary"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Quinary"
      color="quinary"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
    <CardFlat
      title="Black"
      color="black"
      links={[{ href: "#", label: "With link", mode: "inline" }]}
    >
      <p>{faker.lorem.sentences(1)}</p>
    </CardFlat>
  </div>
);

export const Default = Template.bind({});
