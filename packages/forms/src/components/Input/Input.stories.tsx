import { StoryFn, Meta } from "@storybook/react";
import { action } from "storybook/actions";

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
      <Submit data-h2-margin-top="base(x1)" />
    </Form>
  );
};

export const TextInput = {
  render: TemplateInput,

  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        "light mobile": allModes["light mobile"],
        dark: allModes.dark,
      },
    },
  },

  args: {
    type: "text",
    id: "firstName",
    label: "First Name",
    name: "firstName",
    rules: {
      required: "This field is required",
      maxLength: { value: 50, message: "Too long!" },
    },
    context: "Additional context about this field.",
  },
};

export const EmailInput = {
  render: TemplateInput,

  args: {
    type: "email",
    id: "email",
    name: "email",
    label: "Email",
    rules: { required: false },
  },
};

export const PasswordInput = {
  render: TemplateInput,

  args: {
    type: "password",
    id: "password",
    name: "password",
    label: "Password",
    rules: { required: false },
  },
};

export const TelephoneInput = {
  render: TemplateInput,

  args: {
    type: "tel",
    id: "telephone",
    name: "telephone",
    label: "Telephone",
    rules: {
      required: true,
    },
  },
};

export const ElementLabelText = {
  render: TemplateInput,

  args: {
    type: "text",
    id: "firstName",
    label: <span data-h2-font-weight="base(700)">First name</span>,
    name: "firstNameElement",
    rules: {
      required: "This field is required",
      maxLength: { value: 50, message: "Too long!" },
    },
    context: "Additional context about this field.",
  },
};

export const TextInputReadOnly = {
  render: TemplateInput,

  args: {
    type: "text",
    id: "firstName",
    label: "First Name",
    name: "firstName",
    readOnly: true,
  },
};
