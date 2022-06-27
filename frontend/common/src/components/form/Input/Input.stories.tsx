import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Input from ".";
import type { InputProps } from ".";
import Form from "../BasicForm";
import Submit from "../Submit";

export default {
  component: Input,
  title: "Form/Input",
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

const TemplateInput: Story<InputProps & { maxWidth: string }> = (args) => {
  const { maxWidth, ...rest } = args;
  return (
    <div style={{ maxWidth }}>
      <Form onSubmit={action("Submit Form")}>
        <Input {...rest} />
        <Submit />
      </Form>
    </div>
  );
};

export const TextInput = TemplateInput.bind({});

TextInput.args = {
  type: "text",
  id: "firstName",
  label: "First Name",
  name: "firstName",
  rules: {
    required: "This field is required",
    maxLength: { value: 50, message: "Too long!" },
  },
  context: "Additional context about this field.",
};

export const EmailInput = TemplateInput.bind({});

EmailInput.args = {
  type: "email",
  id: "email",
  name: "email",
  label: "Email",
  rules: { required: false },
};

export const PasswordInput = TemplateInput.bind({});

PasswordInput.args = {
  type: "password",
  id: "password",
  name: "password",
  label: "Password",
  rules: { required: false },
};

export const TelephoneInput = TemplateInput.bind({});

TelephoneInput.args = {
  type: "tel",
  id: "telephone",
  name: "telephone",
  label: "Telephone",
  rules: {
    required: true,
  },
};

export const ElementLabelText = TemplateInput.bind({});

ElementLabelText.args = {
  type: "text",
  id: "firstName",
  label: <span data-h2-font-weight="b(700)">First name</span>,
  name: "firstNameElement",
  rules: {
    required: "This field is required",
    maxLength: { value: 50, message: "Too long!" },
  },
  context: "Additional context about this field.",
};
