import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import ResourceBlock, {
  colorOptions,
  ItemProps,
  RootProps,
} from "./ResourceBlock";
import Link from "../Link";

faker.seed(0);

const meta = {
  component: ResourceBlock,
  parameters: {
    chromatic: {
      modes: {
        // component only makes sense at narrow widths
        "light mobile": allModes["light mobile"],
        "dark mobile": allModes["dark mobile"],
      },
    },
  },
} satisfies Meta<typeof ResourceBlock>;

export default meta;

const Template: StoryFn<typeof ResourceBlock> = (args: {
  rootArgs: RootProps;
  itemArgs: Array<ItemProps>;
}) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1)"
  >
    {colorOptions.map((colour) => (
      <ResourceBlock.Root headingColor={colour} {...args.rootArgs} key={colour}>
        {args.itemArgs.map((itemArg) => (
          <ResourceBlock.Item key={itemArg.link.props.href} {...itemArg} />
        ))}
      </ResourceBlock.Root>
    ))}
  </div>
);
export const Default = Template.bind({});
Default.args = {
  rootArgs: {
    title: "Your information",
  },
  itemArgs: [
    {
      link: <Link href="/link1">Link 1</Link>,
      description: faker.lorem.paragraph(),
    },
    {
      link: <Link href="/link2">Link 2</Link>,
      description: faker.lorem.paragraph(),
      state: "complete",
    },
    {
      link: <Link href="/link3">Link 3</Link>,
      description: faker.lorem.paragraph(),
      state: "incomplete",
    },
  ],
};
