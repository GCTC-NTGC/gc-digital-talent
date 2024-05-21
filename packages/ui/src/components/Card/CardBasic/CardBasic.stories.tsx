import type { Meta, StoryObj } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CardBasic from "./CardBasic";

faker.seed(0);

const meta = {
  component: CardBasic,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof CardBasic>;

export default meta;

export const Default: StoryObj<typeof CardBasic> = {
  render: (args) => (
    <CardBasic {...args}>
      <p>{faker.lorem.paragraph()}</p>
    </CardBasic>
  ),
};
