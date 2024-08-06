import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import TaskCard from "./TaskCard";
import Well from "../Well";
import Link from "../Link";

faker.seed(0);

const meta = {
  component: TaskCard,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof TaskCard>;

export default meta;

const Template: StoryFn<typeof TaskCard> = (args) => {
  return (
    <TaskCard {...args}>
      <Well>{faker.lorem.paragraph()}</Well>
    </TaskCard>
  );
};

export const Default = Template.bind({});
Default.args = {
  icon: UsersIcon,
  title: "Your active applications",
  headingColor: "primary",
  link: <Link href="about:blank">Browse new jobs</Link>,
};
