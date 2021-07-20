import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Form from "../components/form/Form";
import Select, { SelectProps } from "../components/form/Select";
import Submit from "../components/form/Submit";

export default {
  component: Select,
  title: "Components/Select",
  argTypes: {
    contextToggleHandler: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateSelect: Story<SelectProps> = (args) => {
  const style = {
    width: "25%",
  };

  return (
    <div style={style}>
      <Form onSubmit={action("Submit Form")}>
        <div>
          <Select {...args} />
          <Submit />
        </div>
      </Form>
    </div>
  );
};

export const SelectDefault = TemplateSelect.bind({});
SelectDefault.args = {
  id: "uniqueId",
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, text: "CRA" },
    { value: 2, text: "CBSA" },
  ],
};

export const SelectRequired = TemplateSelect.bind({});
SelectRequired.args = {
  id: "uniqueId",
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, text: "CRA" },
    { value: 2, text: "CBSA" },
  ],
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredwInfo = TemplateSelect.bind({});
SelectRequiredwInfo.args = {
  id: "uniqueId",
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, text: "CRA" },
    { value: 2, text: "CBSA" },
  ],
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithError = TemplateSelect.bind({});
SelectRequiredWithError.args = {
  id: "uniqueId",
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, text: "CRA" },
    { value: 2, text: "CBSA" },
  ],
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithErrorAndContext = TemplateSelect.bind({});
SelectRequiredWithErrorAndContext.args = {
  id: "uniqueId",
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, text: "CRA" },
    { value: 2, text: "CBSA" },
  ],
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};
