import React from "react";
import { Story, Meta } from "@storybook/react";
import InputContext from "./InputContext";

const meta: Meta = {
  title: "Components/Input Context",
  component: InputContext,
  argTypes: {
    isVisible: { control: "boolean" },
    context: { control: "text" },
  },
};
export default meta;

const Template: Story<React.ComponentProps<typeof InputContext>> = (args) => (
  <InputContext {...args} />
);

export const Context = Template.bind({});
Context.args = {
  isVisible: true,
  context: "We collect the above data for account purposes.",
};
