import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import RadioGroup from ".";
import type { RadioGroupProps } from ".";
import Form from "../BasicForm";
import Submit from "../Submit";

export default {
  component: RadioGroup,
  title: "Form/RadioGroup",
} as Meta;

const TemplateRadioGroup: Story<RadioGroupProps> = (args) => {
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

export const RadioGroupHiddenOptional = TemplateRadioGroup.bind({});
RadioGroupHiddenOptional.args = {
  ...BasicRadioGroup.args,
  hideOptional: true,
};

export const RadioGroupOfElements = TemplateRadioGroup.bind({});
RadioGroupOfElements.args = {
  idPrefix: "elements",
  legend: "Look at these elements",
  name: "elements",
  items: [
    {
      value: "one",
      label: <span data-h2-bg-color="b(red)">Red Selection</span>,
    },
    {
      value: "two",
      label: <span data-h2-bg-color="b(white)">White Selection</span>,
    },
    {
      value: "three",
      label: <span data-h2-font-weight="b(700)">Bold Selection</span>,
    },
  ],
};

export const LargeRadioGroup = TemplateRadioGroup.bind({});
LargeRadioGroup.args = {
  idPrefix: "radiogroup",
  legend: "Which item do you want to check?",
  name: "radiogroup",
  items: [
    { value: "one", label: "Box One" },
    { value: "two", label: "Box Two" },
    { value: "three", label: "Box Three" },
    { value: "four", label: "Box Four" },
    { value: "five", label: "Box Five" },
    { value: "six", label: "Box Six" },
    { value: "seven", label: "Box Seven" },
  ],
  columns: 2,
};
