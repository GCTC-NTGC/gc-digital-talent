import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import ResourceBlock, { colorOptions } from "./ResourceBlock";
import Well from "../Well";

faker.seed(0);

const meta = {
  component: ResourceBlock,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof ResourceBlock>;

export default meta;

const Template: StoryFn<typeof ResourceBlock> = (args) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1)"
  >
    {colorOptions.map((colour) => (
      <ResourceBlock headingColor={colour} {...args} key={colour}>
        <div data-h2-padding="base(x1)">
          <Well>{faker.lorem.paragraph()}</Well>
        </div>
      </ResourceBlock>
    ))}
  </div>
);
export const Default = Template.bind({});
Default.args = {
  title: "Your information",
};
