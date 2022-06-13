import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Checkbox from ".";
import type { CheckboxProps } from ".";

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
export const CheckboxWithBoundingBox = TemplateCheckbox.bind({});
export const CheckboxElementLabel = TemplateCheckbox.bind({});

IndividualCheckbox.args = {
  id: "hasDiploma",
  name: "hasDiploma",
  label: "Have a Diploma",
  context: "This will help prove you satisfy education requirements.",
  rules: { required: "This must be accepted to continue." },
};

CheckboxWithBoundingBox.args = {
  ...IndividualCheckbox.args,
  boundingBox: true,
  boundingBoxLabel: "Bounding box label",
};

CheckboxElementLabel.args = {
  id: "Red Selection",
  name: "Red Selection",
  label: <span data-h2-background-color="b(dt-error)">Red Selection</span>,
};
