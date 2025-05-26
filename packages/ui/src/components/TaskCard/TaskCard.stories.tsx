import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import TaskCard, { colorOptions } from "./TaskCard";
import Well from "../Well/Well";

faker.seed(0);

const meta = {
  component: TaskCard.Root,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof TaskCard.Root>;

export default meta;

const Template: StoryFn<typeof TaskCard.Root> = (args) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1)"
  >
    {colorOptions.map((color) => (
      <TaskCard.Root headingColor={color} {...args} key={color}>
        <TaskCard.Item>
          <Well>{faker.lorem.words()}</Well>
        </TaskCard.Item>
        <TaskCard.Item>
          <Well>{faker.lorem.paragraph()}</Well>
        </TaskCard.Item>
      </TaskCard.Root>
    ))}
  </div>
);
export const Default = Template.bind({});
Default.args = {
  icon: UsersIcon,
  title:
    "Your active applications for this pool since it is a really long title",
  link: {
    label: "Browse new jobs!",
    href: "#",
  },
};

export const NoExtras = Template.bind({});
NoExtras.args = {
  title: "Your active applications",
};
