import { StoryFn, Meta } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Well from "./Well";

faker.seed(0);

export default {
  component: Well,
  args: {
    content: faker.lorem.sentences(2),
  },
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} as Meta;

const Template: StoryFn<typeof Well> = (args) => {
  const { content } = args;
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1 0)"
    >
      <Well>Default: {content}</Well>
      <Well color="primary">Primary: {content}</Well>
      <Well color="secondary">Secondary: {content}</Well>
      <Well color="success">Success: {content}</Well>
      <Well color="warning">Warning: {content}</Well>
      <Well color="error">Error: {content}</Well>
      <Well fontSize="caption">Caption: {content}</Well>
    </div>
  );
};

export const Default = {
  render: Template,
};
