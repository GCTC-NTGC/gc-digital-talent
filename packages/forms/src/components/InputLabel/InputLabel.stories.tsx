import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { FormProvider, useForm } from "react-hook-form";
import InputLabel from "./InputLabel";
import type { InputLabelProps } from "./InputLabel";

export default {
  component: InputLabel,
  title: "Components/Input Label",
  argTypes: {
    contextToggleHandler: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateInputLabel: Story<InputLabelProps> = (args) => {
  const { inputId } = args;
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <div>
        <InputLabel
          {...args}
          contextToggleHandler={action("Context Toggled")}
        />
      </div>
      <div>
        <input id={inputId} type="text" style={{ minWidth: "100%" }} />
      </div>
    </FormProvider>
  );
};

export const Input = TemplateInputLabel.bind({});

Input.args = {
  inputId: "firstName",
  label: "First Name",
  required: false,
  contextIsVisible: true,
  hideOptional: false,
};
