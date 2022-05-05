import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { uniqueId } from "lodash";
import React from "react";
import Form from "../BasicForm";
import Submit from "../Submit";
import MultiSelect from "./MultiSelect";
import type { MultiSelectProps } from ".";

export default {
  component: MultiSelect,
  title: "Form/MultiSelect",
  args: {},
} as Meta;

const TemplateMultiSelect: Story<MultiSelectProps> = (args) => {
  return (
    <Form
      onSubmit={action("Submit Form")}
      options={{ defaultValues: { departments: "" } }}
    >
      <div>
        <MultiSelect {...args} />
        <Submit />
      </div>
    </Form>
  );
};

export const MultiSelectDefault = TemplateMultiSelect.bind({});
MultiSelectDefault.args = {
  id: uniqueId(),
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, label: "CRA" },
    { value: 2, label: "TBS" },
    { value: 3, label: "DND" },
  ],
};

export const MultiSelectRequired = TemplateMultiSelect.bind({});
MultiSelectRequired.args = {
  ...MultiSelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const MultiSelectRequiredWithInfo = TemplateMultiSelect.bind({});
MultiSelectRequiredWithInfo.args = {
  ...MultiSelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const MultiSelectRequiredWithError = TemplateMultiSelect.bind({});
MultiSelectRequiredWithError.args = {
  ...MultiSelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const MultiSelectRequiredWithErrorAndContext = TemplateMultiSelect.bind(
  {},
);
MultiSelectRequiredWithErrorAndContext.args = {
  ...MultiSelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};
