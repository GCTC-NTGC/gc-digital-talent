import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import RadioGroup, { RadioGroupProps } from ".";
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
