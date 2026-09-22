import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import type { StoryFn, Meta } from "@storybook/react-vite";

import Heading from "./Heading";

export default {
  component: Heading,
} as Meta<typeof Heading>;

const Template: StoryFn<typeof Heading> = (args) => (
  <>
    <Heading {...args} rank="h1" color="primary">
      Heading 1
    </Heading>
    <Heading {...args} rank="h2" color="secondary">
      Heading 2
    </Heading>
    <Heading {...args} rank="h3" color="success">
      Heading 3
    </Heading>
    <Heading {...args} rank="h4" color="warning">
      Heading 4
    </Heading>
    <Heading {...args} rank="h5" color="error">
      Heading 5
    </Heading>
    <Heading {...args} rank="h6">
      Heading 6
    </Heading>
  </>
);

export const Default = Template.bind({});

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: AcademicCapIcon,
};
