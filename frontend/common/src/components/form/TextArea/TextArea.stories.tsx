import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "../BasicForm";
import Submit from "../Submit";
import TextArea, { TextAreaProps } from ".";

export default {
  component: TextArea,
  title: "Form/TextArea",
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
export const BasicTextElementLabel = TemplateTextArea.bind({});

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

BasicTextElementLabel.args = {
  id: "element",
  context: "Additional context about this field.",
  label: <span data-h2-font-weight="b(700)">Bolded question</span>,
  name: "element",
};
