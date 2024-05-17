import { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker/locale/en";

import Spoiler from "./Spoiler";

faker.seed(0);

export default {
  component: Spoiler,
};

const Template: StoryFn<typeof Spoiler> = (args) => <Spoiler {...args} />;

export const Default = Template.bind({});
Default.args = {
  linkSuffix: "of the spoiler",
  text: faker.lorem.sentences(3),
};
