import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import InputContext from "./InputContext";

export default {
  title: "Components/Input Context",
  component: InputContext,
  argTypes: {
    isVisible: { control: "boolean" },
    // context: { control: "text" },
  },
} as ComponentMeta<typeof InputContext>;

const Template: ComponentStory<typeof InputContext> = (args) => (
  <InputContext {...args} />
);

export const Context = Template.bind({});
Context.args = {
  isVisible: true,
  context: "We collect the above data for account purposes.",
};

export const ContextWithBold = Template.bind({});
ContextWithBold.args = {
  isVisible: true,
  context: (
    <>
      Now we collect <span data-h2-font-weight="base(700)">even more</span> data
      for you.
    </>
  ),
};
