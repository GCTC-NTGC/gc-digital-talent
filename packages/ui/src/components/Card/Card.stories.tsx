import { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Card from "./Card";

faker.seed(0);

const meta = {
  component: Card,
  subcomponents: { Separator: Card.Separator },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;

export const Default: StoryObj<typeof Card> = {
  render: (args) => (
    <div className="flex flex-col gap-y-6">
      <Card space="sm" {...args}>
        <p>Small space: {faker.lorem.paragraph()}</p>
        <Card.Separator className="my-4" />
        <p>{faker.lorem.paragraph()}</p>
      </Card>
      <Card space="md" {...args}>
        <p>Medium space: {faker.lorem.paragraph()}</p>
        <Card.Separator className="my-4" />
        <p>{faker.lorem.paragraph()}</p>
      </Card>
      <Card space="lg" {...args}>
        <p>Large space: {faker.lorem.paragraph()}</p>
        <Card.Separator className="my-4" />
        <p>{faker.lorem.paragraph()}</p>
      </Card>
    </div>
  ),
};
