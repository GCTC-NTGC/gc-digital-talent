import React from "react";
import { Story, Meta } from "@storybook/react";
import InputContext from "../components/H2Components/InputContext";

const meta: Meta = {
  title: "Components/Input Context",
  component: InputContext,
  argTypes: {
    isVisible: { control: "boolean" },
    error: { control: "text" },
  },
};
export default meta;

const Template: Story<React.ComponentProps<typeof InputContext>> = (args) => (
  <InputContext {...args} />
);

export const Context = Template.bind({});
Context.args = {
  isVisible: true,
  error: "We collect the above data for account purposes.",
};
