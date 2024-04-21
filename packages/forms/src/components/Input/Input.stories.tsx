import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Form from "../BasicForm";
import Submit from "../Submit";

import Input from ".";
import type { InputProps } from ".";

export default {
  component: Input,
  title: "Form/Input",
} as Meta;

const themes = ["light", "dark"];

const TemplateInput: StoryFn<InputProps> = (args) => {
  const { ...rest } = args;
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <Form onSubmit={action("Submit Form")}>
              <Input {...rest} />
              <p className="mt-6">
                <Submit />
              </p>
            </Form>
          </div>
        </div>
      ))}
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
  label: <span className="font-bold">First name</span>,
  name: "firstNameElement",
  rules: {
    required: "This field is required",
    maxLength: { value: 50, message: "Too long!" },
  },
  context: "Additional context about this field.",
};

export const ReadOnlyTextInput = TemplateInput.bind({});

ReadOnlyTextInput.args = {
  type: "text",
  id: "firstName",
  label: "First Name",
  name: "firstName",
  readOnly: true,
};
