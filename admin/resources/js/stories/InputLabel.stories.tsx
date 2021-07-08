import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import InputLabel, {
  InputLabelProps,
} from "../components/H2Components/InputLabel";

export default {
  component: InputLabel,
  title: "Components/Input Label",
  argTypes: {
    contextClickHandler: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateInputLabel: Story<InputLabelProps> = (args) => {
  const { id } = args;
  return (
    <div data-h2-flex-grid="b(middle, contained, flush, none)">
      <div data-h2-flex-item="b(1of1)">
        <InputLabel {...args} contextClickHandler={action("Context Clicked")} />
      </div>
      <div data-h2-flex-item="b(1of1)">
        <input id={id} type="text" style={{ minWidth: "100%" }} />
      </div>
    </div>
  );
};

export const Input = TemplateInputLabel.bind({});

Input.args = {
  id: "firstName",
  label: "First Name",
  required: false,
  contextIsVisible: true,
};
