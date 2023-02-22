import React from "react";
import { Story, Meta } from "@storybook/react";
import InputError from "./InputError";

const meta: Meta = {
  title: "Components/Input Error",
  component: InputError,
  argTypes: {
    isVisible: { control: "boolean" },
    error: { control: "text" },
  },
};
export default meta;

const Template: Story<React.ComponentProps<typeof InputError>> = (args) => (
  <InputError {...args} />
);

export const Error = Template.bind({});
Error.args = {
  isVisible: true,
  error: "Oh no, something went wrong!",
};
