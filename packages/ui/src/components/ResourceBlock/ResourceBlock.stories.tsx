import type { Meta, StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import { RootProps } from "./Root";
import Ul from "../List/Ul";
import Button from "../Button";
import Link from "../Link";

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
  <div className="flex flex-col gap-6">
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
        <ResourceBlock.RawContentItem title={faker.lorem.words(10)} as="h3">
          <Ul unStyled space="sm">
            <li>
              <Button mode="text" color="black">
                Item 1
              </Button>
            </li>
            <li>
              <Link href="#" color="black">
                Item 2
              </Link>
            </li>
          </Ul>
        </ResourceBlock.RawContentItem>
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
