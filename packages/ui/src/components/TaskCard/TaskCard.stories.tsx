import type { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import { action } from "storybook/actions";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Notice from "../Notice/Notice";
import type { RootProps } from "./TaskCard";
import TaskCard from "./TaskCard";

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
  args: {
    title: "Task card",
  },
  render: (args) => (
    <div className="flex flex-col gap-6">
      {colorOptions.map((color) => (
        <TaskCard.Root headingColor={color} {...args} key={color}>
          <TaskCard.Item>
            <Notice.Root>
              <Notice.Content>{faker.lorem.words()}</Notice.Content>
            </Notice.Root>
          </TaskCard.Item>
          <TaskCard.Item>
            <Notice.Root>
              <Notice.Content>{faker.lorem.paragraph()}</Notice.Content>
            </Notice.Root>
          </TaskCard.Item>
        </TaskCard.Root>
      ))}
    </div>
  ),
} satisfies Meta<typeof TaskCard.Root>;

export default meta;

type Story = StoryObj<typeof TaskCard.Root>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    title: "With icon",
    icon: UsersIcon,
  },
};

export const WithLink: Story = {
  args: {
    title: "With link",
    action: {
      href: "#",
      label: "Task card link",
    },
  },
};

export const WithButton: Story = {
  args: {
    title: "With action",
    action: {
      onClick: () => {
        action("onClick: TaskCardAction")();
      },
      label: "Task card button",
    },
  },
};

export const Locked: Story = {
  args: {
    locked: true,
    icon: UsersIcon,
    title: "Locked card",
    action: {
      label: "Disabled action",
      href: "#",
    },
  },
};
