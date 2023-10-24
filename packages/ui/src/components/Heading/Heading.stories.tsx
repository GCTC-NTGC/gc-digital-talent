import React from "react";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import { StoryFn, Meta } from "@storybook/react";

import Heading from "./Heading";

export default {
  component: Heading,
  title: "Components/Heading",
  args: {
    children: "Heading",
  },
} as Meta<typeof Heading>;

const Single: StoryFn<typeof Heading> = (args) => <Heading {...args} />;
const All: StoryFn<typeof Heading> = (args) => (
  <>
    <Heading {...args} level="h1">
      Heading 1
    </Heading>
    <Heading {...args} level="h2">
      Heading 2
    </Heading>
    <Heading {...args} level="h3">
      Heading 3
    </Heading>
    <Heading {...args} level="h4">
      Heading 4
    </Heading>
    <Heading {...args} level="h5">
      Heading 5
    </Heading>
    <Heading {...args} level="h6">
      Heading 6
    </Heading>
  </>
);

export const Default = Single.bind({});

export const AllLevels = All.bind({});

export const WithIcon = All.bind({});
WithIcon.args = {
  Icon: AcademicCapIcon,
};
