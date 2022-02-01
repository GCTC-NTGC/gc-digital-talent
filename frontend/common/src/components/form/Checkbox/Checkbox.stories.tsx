import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Checkbox, { CheckboxProps } from ".";
import Form from "../BasicForm";
import Submit from "../Submit";

export default {
  component: Checkbox,
  title: "Form/Checkbox",
} as Meta;

const TemplateCheckbox: Story<CheckboxProps> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <Checkbox {...args} />
      <Submit />
    </Form>
  );
};

export const IndividualCheckbox = TemplateCheckbox.bind({});

IndividualCheckbox.args = {
  id: "hasDiploma",
  name: "hasDiploma",
  label: "Have a Diploma",
  context: "This will help prove you satisfy education requirements.",
  rules: { required: "This must be accepted to continue." },
};
