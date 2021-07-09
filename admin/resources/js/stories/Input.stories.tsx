import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Input, { InputProps } from "../components/form/Input";
import Form from "../components/form/Form";
import Submit from "../components/form/Submit";

export default {
  component: Input,
  title: "Form/Input",
} as Meta;

const TemplateInput: Story<InputProps> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <Input {...args} />
      <Submit />
    </Form>
  );
};

export const TextInput = TemplateInput.bind({});

TextInput.args = {
  type: "text",
  id: "firstName",
  label: "First Name",
  name: "firstName",
  rules: { required: "This field is required", maxLength: 100 },
};

export const EmailInput = TemplateInput.bind({});

EmailInput.args = {
  type: "email",
  id: "email",
  name: "email",
  label: "Email",
  rules: { required: false },
};

export const TelephoneInput = TemplateInput.bind({});

TelephoneInput.args = {
  type: "tel",
  id: "telephone",
  name: "telephone",
  label: "Telephone",
  rules: {
    required: "This field is required",
    pattern: {
      value: /^\+[1-9]\d{1,14}$/,
      message: "This field must follow the pattern +123243234.",
    },
  },
};

export const CheckboxInput = TemplateInput.bind({});

CheckboxInput.args = {
  type: "checkbox",
  id: "hasDiploma",
  name: "hasDiploma",
  label: "Have a Diploma",
};
