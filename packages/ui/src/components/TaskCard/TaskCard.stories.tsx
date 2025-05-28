import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Well from "../Well/Well";
import TaskCard, { RootProps } from "./TaskCard";

const colorOptions: RootProps["headingColor"][] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
];

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
  <div className="flex flex-col gap-6">
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
