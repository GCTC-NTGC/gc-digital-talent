import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { uniqueId } from "lodash";
import React from "react";
import Form from "../BasicForm";
import Submit from "../Submit";
import MultiSelect from "./MultiSelect";

export default {
  component: MultiSelect,
  title: "Form/MultiSelect",
} as ComponentMeta<typeof MultiSelect>;

const TemplateMultiSelect: ComponentStory<typeof MultiSelect> = (args) => {
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

export const Default = TemplateMultiSelect.bind({});
Default.args = {
  id: uniqueId(),
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, label: "CRA" },
    { value: 2, label: "TBS" },
    { value: 3, label: "DND" },
  ],
};

export const Required = TemplateMultiSelect.bind({});
Required.args = {
  ...Default.args,
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithInfo = TemplateMultiSelect.bind({});
RequiredWithInfo.args = {
  ...Default.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithError = TemplateMultiSelect.bind({});
RequiredWithError.args = {
  ...Default.args,
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithErrorAndContext = TemplateMultiSelect.bind({});
RequiredWithErrorAndContext.args = {
  ...Default.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};
