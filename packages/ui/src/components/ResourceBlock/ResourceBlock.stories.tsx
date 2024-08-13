import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import ResourceBlock, { colorOptions } from "./ResourceBlock";
import Link from "../Link";

faker.seed(0);

const meta = {
  component: ResourceBlock.Root,
  parameters: {
    chromatic: {
      modes: {
        // component only makes sense at narrow widths
        "light mobile": allModes["light mobile"],
        "dark mobile": allModes["dark mobile"],
      },
    },
  },
} satisfies Meta<typeof ResourceBlock.Root>;

export default meta;

const Template: StoryFn<typeof ResourceBlock.Root> = (args) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1)"
  >
    {colorOptions.map((colour) => (
      <ResourceBlock.Root headingColor={colour} {...args} key={colour}>
        <ResourceBlock.Item
          title={faker.commerce.productName()}
          href={faker.internet.url()}
          description={faker.lorem.paragraph()}
        />
        <ResourceBlock.Item
          title={faker.commerce.productName()}
          href={faker.internet.url()}
          description={faker.lorem.paragraph()}
          state="complete"
        />
        <ResourceBlock.Item
          title={faker.commerce.productName()}
          href={faker.internet.url()}
          description={faker.lorem.paragraph()}
          state="incomplete"
        />
      </ResourceBlock.Root>
    ))}
  </div>
);
export const Default = Template.bind({});
Default.args = {
  title: faker.lorem.words(5),
};
