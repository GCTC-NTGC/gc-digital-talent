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
  const { id } = args;
  const methods = useForm<any>();
  return (
    <FormProvider {...methods}>
      <div>
        <Select {...args} />
      </div>
      <div>
        <input id={id} type="text" style={{ minWidth: "100%" }} />
      </div>
    </FormProvider>
  );
};

export const SelectComp = TemplateSelect.bind({});

SelectComp.args = {
  id: "uniqueId",
  label: "Select a dept",
  name: "departments",
  options: [
    { value: 1, text: "CRA" },
    { value: 2, text: "CBSA" },
  ],
};
