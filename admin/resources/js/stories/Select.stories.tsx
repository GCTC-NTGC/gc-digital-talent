import React from "react";
import { Story, Meta } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import Select, { SelectProps } from "../components/H2Components/Select";

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

  const methods = useForm<SelectProps>();
  return (
    <div style={style}>
      <FormProvider {...methods}>
        <div>
          <Select {...args} />
        </div>
      </FormProvider>
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
  rules: {
    required: true,
  },
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
  rules: {
    required: true,
  },
};

export const SelectRequiredwError = TemplateSelect.bind({});
SelectRequiredwError.args = {
  id: "uniqueId",
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, text: "CRA" },
    { value: 2, text: "CBSA" },
  ],
  error: "The field above needs to be complete in order to proceed.",
  rules: {
    required: true,
  },
};
