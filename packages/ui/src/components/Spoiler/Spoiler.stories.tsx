import React from "react";
import { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";

import Spoiler from "./Spoiler";

faker.seed(0);

export default {
  component: Spoiler,
  title: "Components/Spoiler",
};

const Template: StoryFn<typeof Spoiler> = (args) => <Spoiler {...args} />;

export const Default = Template.bind({});
Default.args = {
  linkSuffix: "of the spoiler",
  text: faker.lorem.sentences(3),
};
