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

export const WithGrid: StoryObj<typeof Card> = {
  render: (args) => (
    <div className="flex flex-col gap-y-6">
      <Card space="sm" {...args}>
        <Card.Grid columns={2}>
          <Card.GridItem>
            <p>Small space: {faker.lorem.paragraph()}</p>
          </Card.GridItem>
          <Card.GridItem>
            <p>2 columns: {faker.lorem.paragraph()}</p>
          </Card.GridItem>
        </Card.Grid>
        <Card.Separator className="my-4" />
        <p>{faker.lorem.paragraph()}</p>
      </Card>
      <Card space="md" {...args}>
        <Card.Grid columns={3}>
          <Card.GridItem>
            <p>Medium space: {faker.lorem.paragraph()}</p>
          </Card.GridItem>
          <Card.GridItem>
            <p>3 columns: {faker.lorem.paragraph()}</p>
          </Card.GridItem>
          <Card.GridItem>
            <p>{faker.lorem.paragraph()}</p>
          </Card.GridItem>
        </Card.Grid>
        <Card.Separator className="my-6" />
        <p>{faker.lorem.paragraph()}</p>
      </Card>
      <Card space="lg" {...args}>
        <Card.Grid columns={4}>
          <Card.GridItem>
            <p>Large space: {faker.lorem.paragraph()}</p>
          </Card.GridItem>
          <Card.GridItem>
            <p>4 columns: {faker.lorem.paragraph()}</p>
          </Card.GridItem>
          <Card.GridItem>
            <p>{faker.lorem.paragraph()}</p>
          </Card.GridItem>
          <Card.GridItem>
            <p>{faker.lorem.paragraph()}</p>
          </Card.GridItem>
        </Card.Grid>
        <Card.Separator className="my-6 sm:my-9" />
        <p>{faker.lorem.paragraph()}</p>
      </Card>
    </div>
  ),
};
