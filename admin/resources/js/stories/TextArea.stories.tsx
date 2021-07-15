import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import Form from "../components/form/Form";
import Submit from "../components/form/Submit";
import TextArea, { TextAreaProps } from "../components/form/TextArea";

export default {
  component: TextArea,
  title: "Form/TextArea",
} as Meta;

const TemplateTextArea: Story<TextAreaProps> = (args) => {
  return (
    <div style={{ width: "20rem" }}>
      <Form onSubmit={action("Submit Form")}>
        <TextArea {...args} />
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
  rules: { required: "This field is required", maxLength: 100 },
};
