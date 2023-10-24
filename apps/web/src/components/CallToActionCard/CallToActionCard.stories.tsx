import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import CallToActionCard from "./CallToActionCard";

faker.seed(0);

export default {
  component: CallToActionCard,
  title: "Components/Call to Action Card",
  args: {
    heading: faker.lorem.lines(1),
    link: {
      href: "/#",
      label: faker.lorem.words(3),
    },
    children: <p>{faker.lorem.sentence()}</p>,
  },
} as Meta<typeof CallToActionCard>;

const Template: StoryFn<typeof CallToActionCard> = (args) => {
  return <CallToActionCard {...args} />;
};

export const Default = Template.bind({});
