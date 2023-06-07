import React from "react";
import { action } from "@storybook/addon-actions";
import { StoryFn } from "@storybook/react";
import Form from "../BasicForm";
import Submit from "../Submit";
import TextArea from ".";
import type { TextAreaProps } from ".";

export default {
  component: TextArea,
  title: "Form/TextArea",
  args: {
    id: "description",
    name: "description",
    label: "Description",
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
};

const TemplateTextArea: StoryFn<TextAreaProps & { maxWidth: string }> = (
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

export const Default = TemplateTextArea.bind({});
Default.args = {
  context: "Additional context about this field.",
  rules: {
    required: "This field is required",
  },
};

export const CustomLabel = TemplateTextArea.bind({});
CustomLabel.args = {
  label: <span data-h2-font-weight="base(700)">Bolded question</span>,
};

export const WordLimit = TemplateTextArea.bind({});
WordLimit.args = {
  wordLimit: 10,
};
