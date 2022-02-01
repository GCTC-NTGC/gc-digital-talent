import React from "react";
import { Story, Meta } from "@storybook/react";
import { Fieldset, FieldsetProps } from "./Fieldset";

export default {
  component: Fieldset,
  title: "Components/Fieldset",
} as Meta;

const TemplateFieldset: Story<FieldsetProps> = (args) => {
  const { name } = args;
  return (
    <Fieldset {...args}>
      <label data-h2-display="b(block)">
        One
        <input type="checkbox" name={name} value="One" />
      </label>
      <label data-h2-display="b(block)">
        Two
        <input type="checkbox" name={name} value="Two" />
      </label>
      <label data-h2-display="b(block)">
        Three
        <input type="checkbox" name={name} value="Three" />
      </label>
    </Fieldset>
  );
};

export const FieldsetAroundChecklist = TemplateFieldset.bind({});

FieldsetAroundChecklist.args = {
  legend: "My Field of Inputs",
  name: "This must match name of input fields inside.",
  required: true,
  error: "One of these must be selected",
  context:
    "The Fieldset component is very similar to InputWrapper, but uses the <legend> element instead of <label>, and wraps everything in <fieldset>.",
  disabled: false,
  hideOptional: false,
};
