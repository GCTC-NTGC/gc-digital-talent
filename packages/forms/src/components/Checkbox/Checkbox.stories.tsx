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
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </Form>
  );
};

export const IndividualCheckbox = TemplateCheckbox.bind({});
export const CheckboxWithBoundingBox = TemplateCheckbox.bind({});
export const CheckboxElementLabel = TemplateCheckbox.bind({});
export const LongTextCheckbox = TemplateCheckbox.bind({});

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
  label: <span data-h2-background-color="base(error)">Red Selection</span>,
};

LongTextCheckbox.args = {
  id: "iAgree",
  name: "iAgree",
  label:
    "I agree to share this information with verified Government of Canada hiring managers and HR advisors who have access to this platform.",
  context: "This is a really long string.",
  rules: { required: "This must be accepted to continue." },
};

LongTextCheckbox.parameters = {
  viewport: {
    defaultViewport: "mobile1",
  },
};
