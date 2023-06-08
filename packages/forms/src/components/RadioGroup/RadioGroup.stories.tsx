import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import RadioGroup from "./RadioGroup";
import Form from "../BasicForm";
import Submit from "../Submit";

export default {
  component: RadioGroup,
  title: "Form/RadioGroup",
};

const TemplateRadioGroup: StoryFn<typeof RadioGroup> = (args) => {
  return (
    <Form onSubmit={action("Submit Form")}>
      <RadioGroup {...args} />
      <Submit />
    </Form>
  );
};

export const BasicRadioGroup = TemplateRadioGroup.bind({});
BasicRadioGroup.args = {
  idPrefix: "radiogroup",
  legend: "Which item do you want to check?",
  name: "radiogroup",
  items: [
    { value: "one", label: "Box One" },
    { value: "two", label: "Box Two" },
    { value: "three", label: "Box Three" },
  ],
};

export const RequiredRadioGroup = TemplateRadioGroup.bind({});
RequiredRadioGroup.args = {
  ...BasicRadioGroup.args,
  rules: { required: "At least one item must be checked!" },
};

export const RadioGroupWithContext = TemplateRadioGroup.bind({});
RadioGroupWithContext.args = {
  ...BasicRadioGroup.args,
  context:
    "Check the action tab after submitting to see how the form values are represented.",
};

export const DisabledRadioGroup = TemplateRadioGroup.bind({});
DisabledRadioGroup.args = {
  ...BasicRadioGroup.args,
  disabled: true,
};

export const RadioGroupOfElements = TemplateRadioGroup.bind({});
RadioGroupOfElements.args = {
  idPrefix: "elements",
  legend: "Look at these elements",
  name: "elements",
  items: [
    {
      value: "one",
      label: <span data-h2-background-color="base(error)">Red Selection</span>,
    },
    {
      value: "two",
      label: (
        <span data-h2-background-color="base(white)">White Selection</span>
      ),
    },
    {
      value: "three",
      label: <span data-h2-font-weight="base(700)">Bold Selection</span>,
    },
  ],
};

export const LargeRadioGroup = TemplateRadioGroup.bind({});
LargeRadioGroup.parameters = {
  viewport: {
    defaultViewport: "iphone6p",
  },
};
LargeRadioGroup.args = {
  idPrefix: "radiogroup",
  legend: "Which item do you want to check?",
  name: "radiogroup",
  items: [
    { value: "one", label: "This is the first item" },
    { value: "two", label: "This is the second item" },
    { value: "three", label: "This is the third item" },
    { value: "four", label: "This is the fourth item" },
    { value: "five", label: "This is the fifth item" },
    { value: "six", label: "This is the sixth item" },
    { value: "seven", label: "This is the seventh item" },
  ],
  columns: 2,
};
