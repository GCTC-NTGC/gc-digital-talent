import React from "react";
import { Story, Meta } from "@storybook/react";
import { InputWrapper } from "./InputWrapper";
import type { InputWrapperProps } from "./InputWrapper";

export default {
  component: InputWrapper,
  title: "Components/Input Wrapper",
} as Meta;

const TemplateInputWrapper: Story<InputWrapperProps> = (args) => {
  const { inputId } = args;
  return (
    <InputWrapper {...args}>
      <input id={inputId} type="text" style={{ minWidth: "100%" }} />
    </InputWrapper>
  );
};

export const InputWrapperWithTextInput = TemplateInputWrapper.bind({});

InputWrapperWithTextInput.args = {
  inputId: "firstName",
  label: "First Name",
  required: true,
  error: "This input is required",
  context:
    "We collect the above data for account purposes. It may be shared with Hiring Managers.",
};
