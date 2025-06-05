import { StoryFn, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import Input, { type InputProps } from "./Input";

export default {
  component: Input,
} as Meta;

const TemplateInput: StoryFn<InputProps> = (args) => {
  const { ...rest } = args;
  return (
    <Form onSubmit={action("Submit Form")}>
      <Input {...rest} />
      <Submit className="mt-6" />
    </Form>
  );
};

export const TextInput = TemplateInput.bind({});

TextInput.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};

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
  label: <span data-h2-font-weight="base(700)">First name</span>,
  name: "firstNameElement",
  rules: {
    required: "This field is required",
    maxLength: { value: 50, message: "Too long!" },
  },
  context: "Additional context about this field.",
};

export const TextInputReadOnly = TemplateInput.bind({});

TextInputReadOnly.args = {
  type: "text",
  id: "firstName",
  label: "First Name",
  name: "firstName",
  readOnly: true,
};
