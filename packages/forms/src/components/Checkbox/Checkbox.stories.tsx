import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { VIEWPORT } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";

import Checkbox from ".";
import type { CheckboxProps } from ".";

export default {
  component: Checkbox,
  title: "Form/Checkbox",
} as Meta;

const themes = ["light", "dark"];

const TemplateCheckbox: StoryFn<CheckboxProps> = (args) => {
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <Form onSubmit={action("Submit Form")}>
              <Checkbox {...args} />
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
  label: (
    <span data-h2-background-color="base(error.lighter)">Red Selection</span>
  ),
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
    defaultViewport: VIEWPORT.PHONE,
  },
};
