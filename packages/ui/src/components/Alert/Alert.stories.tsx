import BellIcon from "@heroicons/react/24/outline/BellIcon";
import { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Alert from "./Alert";

faker.seed(0);

export default {
  component: Alert.Root,
  args: {
    children: faker.lorem.sentences(3),
    icon: BellIcon,
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
} as Meta<typeof Alert.Root>;

const Template: StoryFn<typeof Alert.Root> = (args) => (
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
);

export const Default = Template.bind({});
