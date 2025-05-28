import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import { RootProps } from "./Root";

import ResourceBlock from "./";

faker.seed(0);

const colorOptions: RootProps["headingColor"][] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
];

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
      <ResourceBlock.Root
        headingColor={colour}
        title={
          <>
            {args.title} {colour}
          </>
        }
        key={colour}
      >
        <ResourceBlock.SingleLinkItem
          title={faker.lorem.words(10)}
          href={faker.internet.url()}
          description={faker.lorem.paragraph()}
        />
        <ResourceBlock.LinkMenuItem
          links={[
            {
              title: "link 1",
              href: faker.internet.url(),
              isSelected: false,
            },
            {
              title: "link 2",
              href: faker.internet.url(),
              isSelected: true,
            },
          ]}
          description={faker.lorem.paragraph()}
          state="complete"
        />
        <ResourceBlock.SingleLinkItem
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
