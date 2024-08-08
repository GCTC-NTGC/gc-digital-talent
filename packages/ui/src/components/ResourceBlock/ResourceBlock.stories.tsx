import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import ResourceBlock, { colorOptions, RootProps } from "./ResourceBlock";
import Link from "../Link";

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
      <ResourceBlock.Root headingColor={colour} {...args.Root} key={colour}>
        {args.item.map((itemArg) => (
          <ResourceBlock.Item key={itemArg.key} {...itemArg} />
        ))}
      </ResourceBlock.Root>
    ))}
  </div>
);
export const Default = Template.bind({});
Default.args = {
  Root: {
    title: "Your information",
  } satisfies RootProps,
  item: [
    {
      key: 1,
      link: <Link href="#">Link 1</Link>,
      description:
        "Manage info related to job eligibility, including equity, language, and work preferences.",
    },
    {
      key: 2,
      link: <Link href="#">Link 2</Link>,
      description:
        "Manage info related to job eligibility, including equity, language, and work preferences.",
      state: "complete",
    },
    {
      key: 3,
      link: <Link href="#">Link 3</Link>,
      description:
        "Manage info related to job eligibility, including equity, language, and work preferences.",
      state: "incomplete",
    },
  ],
};
