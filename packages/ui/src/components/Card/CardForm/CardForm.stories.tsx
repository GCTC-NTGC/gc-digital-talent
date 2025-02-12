import type { Meta, StoryObj } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import CardForm from "./CardForm";

faker.seed(0);

const meta = {
  component: CardForm,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof CardForm>;

export default meta;

export const Default: StoryObj<typeof CardForm> = {
  render: (args) => (
    <CardForm {...args}>
      <p>{faker.lorem.paragraph()}</p>
    </CardForm>
  ),
};
