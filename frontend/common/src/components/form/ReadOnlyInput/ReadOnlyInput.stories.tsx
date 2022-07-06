import React from "react";
import { Story, Meta } from "@storybook/react";
import Input from ".";
import type { ReadOnlyInputProps } from ".";

export default {
  component: Input,
  title: "Form/Read Only Input",
  args: {
    maxWidth: "20rem",
  },
  argTypes: {
    maxWidth: {
      name: "Max Width",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
  },
} as Meta;

const TemplateInput: Story<ReadOnlyInputProps & { maxWidth: string }> = (
  args,
) => {
  const { maxWidth, ...rest } = args;
  return (
    <div style={{ maxWidth }}>
      <Input {...rest} />
    </div>
  );
};

export const TextInput = TemplateInput.bind({});

TextInput.args = {
  type: "text",
  id: "firstName",
  name: "firstName",
  value: "First Name",
};

export const EmailInput = TemplateInput.bind({});

EmailInput.args = {
  type: "email",
  id: "email",
  name: "email",
  value: "Email",
};

export const PasswordInput = TemplateInput.bind({});

PasswordInput.args = {
  type: "password",
  id: "password",
  name: "password",
  value: "Password",
};

export const TelephoneInput = TemplateInput.bind({});

TelephoneInput.args = {
  type: "tel",
  id: "telephone",
  name: "telephone",
  value: "Telephone",
};
