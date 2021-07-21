import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "../components/form/Form";
import Submit from "../components/form/Submit";
import TextArea, { TextAreaProps } from "../components/form/TextArea";

export default {
  component: TextArea,
  title: "Form/TextArea",
  argTypes: {
    maxWidth: {
      name: "Max Width",
      type: { name: "string", required: true },
      defaultValue: "20rem",
      table: {
        type: { summary: "string" },
        defaultValue: { summary: "Button Label" },
      },
      control: {
        type: "text",
      },
    },
  },
} as Meta;

const TemplateTextArea: Story<TextAreaProps & { maxWidth: string }> = (
  args,
) => {
  const { maxWidth, ...rest } = args;
  return (
    <div style={{ maxWidth }}>
      <Form onSubmit={action("Submit Form")}>
        <TextArea {...rest} />
        <Submit />
      </Form>
    </div>
  );
};

export const BasicTextArea = TemplateTextArea.bind({});

BasicTextArea.args = {
  id: "description",
  context: "Additional context about this field.",
  label: "Description",
  name: "description",
  rules: {
    required: "This field is required",
    maxLength: { value: 500, message: "Too long!" },
  },
};
