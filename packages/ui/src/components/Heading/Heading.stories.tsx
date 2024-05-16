import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import { StoryFn, Meta } from "@storybook/react";

import Heading from "./Heading";

export default {
  component: Heading,
} as Meta<typeof Heading>;

const Template: StoryFn<typeof Heading> = (args) => (
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

export const Default = Template.bind({});

export const WithIcon = Template.bind({});
WithIcon.args = {
  Icon: AcademicCapIcon,
};
