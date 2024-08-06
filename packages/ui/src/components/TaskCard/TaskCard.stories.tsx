import type { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import TaskCard, { colorOptions } from "./TaskCard";
import Well from "../Well";

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

const Template: StoryFn<typeof TaskCard> = (args) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x1)"
  >
    {colorOptions.map((colour) => (
      <TaskCard headingColor={colour} {...args} key={colour}>
        <div data-h2-padding="base(x1)">
          <Well>{faker.lorem.paragraph()}</Well>
        </div>
      </TaskCard>
    ))}
  </div>
);
export const Default = Template.bind({});
Default.args = {
  icon: UsersIcon,
  title: "Your active applications",
  linkText: "Browse new jobs",
  linkHref: "#",
};

export const NoExtras = Template.bind({});
NoExtras.args = {
  title: "Your active applications",
};
