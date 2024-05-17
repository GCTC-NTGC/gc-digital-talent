import { StoryFn } from "@storybook/react";

import Context from "./Context";

export default {
  component: Context,
};

const Template: StoryFn<typeof Context> = (args) => <Context {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "This is a description",
};
