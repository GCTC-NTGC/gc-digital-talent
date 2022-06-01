import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";
import Form from "../BasicForm";
import Select from ".";
import type { SelectProps } from ".";
import Submit from "../Submit";

export default {
  component: Select,
  title: "Form/Select",
  argTypes: {
    contextToggleHandler: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateSelect: Story<SelectProps> = (args) => {
  return (
    <Form
      onSubmit={action("Submit Form")}
      options={{ defaultValues: { departments: "" } }}
    >
      <div>
        <Select {...args} />
        <Submit />
      </div>
    </Form>
  );
};

export const SelectDefault = TemplateSelect.bind({});
SelectDefault.args = {
  id: uniqueId(),
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, label: "CRA" },
    { value: 2, label: "CBSA" },
  ],
};

export const SelectWithEmptyOption = TemplateSelect.bind({});
SelectWithEmptyOption.args = {
  ...SelectDefault.args,
  options: [
    { value: "", label: "Select an option...", disabled: true },
    { value: 1, label: "CRA" },
    { value: 2, label: "CBSA" },
  ],
};

export const SelectRequired = TemplateSelect.bind({});
SelectRequired.args = {
  ...SelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithInfo = TemplateSelect.bind({});
SelectRequiredWithInfo.args = {
  ...SelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithError = TemplateSelect.bind({});
SelectRequiredWithError.args = {
  ...SelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithErrorAndContext = TemplateSelect.bind({});
SelectRequiredWithErrorAndContext.args = {
  ...SelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectLabelElement = TemplateSelect.bind({});
SelectLabelElement.args = {
  label: <span data-h2-font-weight="b(700)">Bold Label</span>,
  name: "LabelElement",
  options: [
    { value: 1, label: "CRA" },
    { value: 2, label: "CBSA" },
  ],
};
