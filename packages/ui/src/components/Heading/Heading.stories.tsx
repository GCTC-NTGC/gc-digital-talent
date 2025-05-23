import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import { StoryFn, Meta } from "@storybook/react";

import Heading from "./Heading";

export default {
  component: Heading,
} as Meta<typeof Heading>;

const Template: StoryFn<typeof Heading> = (args) => (
  <>
    <Heading {...args} level="h1" color="primary">
      Heading 1
    </Heading>
    <Heading {...args} level="h2" color="secondary">
      Heading 2
    </Heading>
    <Heading {...args} level="h3" color="success">
      Heading 3
    </Heading>
    <Heading {...args} level="h4" color="warning">
      Heading 4
    </Heading>
    <Heading {...args} level="h5" color="error">
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
