import { Meta, StoryObj } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Alert from "./Alert";

faker.seed(0);

const meta = {
  component: Alert.Root,
  args: {
    children: faker.lorem.sentences(3),
  },
  argTypes: {
    dismissible: {
      control: "boolean",
    },
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof Alert.Root>;

export default meta;

export const Default: StoryObj<typeof Alert.Root> = {
  args: {
    dismissible: true,
  },

  render: (args) => (
    <div data-h2-gap="base(0 x1)">
      <Alert.Root {...args} type="info">
        <Alert.Title>{faker.lorem.sentences(1)}</Alert.Title>
        <p>{faker.lorem.sentences(2)}</p>
        <Alert.Footer>
          <p>{faker.lorem.sentences(1)}</p>
        </Alert.Footer>
      </Alert.Root>
      <Alert.Root {...args} type="success">
        <Alert.Title>{faker.lorem.sentences(1)}</Alert.Title>
        <p>{faker.lorem.sentences(2)}</p>
        <Alert.Footer>
          <p>{faker.lorem.sentences(1)}</p>
        </Alert.Footer>
      </Alert.Root>
      <Alert.Root {...args} type="warning">
        <Alert.Title>{faker.lorem.sentences(1)}</Alert.Title>
        <p>{faker.lorem.sentences(2)}</p>
        <Alert.Footer>
          <p>{faker.lorem.sentences(1)}</p>
        </Alert.Footer>
      </Alert.Root>
      <Alert.Root {...args} type="error">
        <Alert.Title>{faker.lorem.sentences(1)}</Alert.Title>
        <p>{faker.lorem.sentences(2)}</p>
        <Alert.Footer>
          <p>{faker.lorem.sentences(1)}</p>
        </Alert.Footer>
      </Alert.Root>
    </div>
  ),
};
