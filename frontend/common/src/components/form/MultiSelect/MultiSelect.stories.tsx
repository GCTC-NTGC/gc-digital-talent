import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { uniqueId } from "lodash";
import React from "react";
import BasicForm from "../BasicForm";
import Submit from "../Submit";
import MultiSelect from "./MultiSelect";

export default {
  component: MultiSelect,
  title: "Form/MultiSelect",
} as ComponentMeta<typeof MultiSelect>;

const Template: ComponentStory<typeof MultiSelect> = (args) => {
  return (
    <BasicForm
      onSubmit={action("Submit Form")}
      options={{ defaultValues: { departments: "" } }}
    >
      <div>
        <MultiSelect {...args} />
        <Submit />
      </div>
    </BasicForm>
  );
};

export const Default = Template.bind({});
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

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithInfo = Template.bind({});
RequiredWithInfo.args = {
  ...Default.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithError = Template.bind({});
RequiredWithError.args = {
  ...Default.args,
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithErrorAndContext = Template.bind({});
RequiredWithErrorAndContext.args = {
  ...Default.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};
