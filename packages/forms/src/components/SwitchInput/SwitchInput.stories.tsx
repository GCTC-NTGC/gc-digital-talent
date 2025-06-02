import type { StoryFn } from "@storybook/react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import { action } from "storybook/actions";

import { SwitchProps } from "@gc-digital-talent/ui";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import SwitchInput, { SwitchInputProps } from "./SwitchInput";

type SwitchInputArgs = SwitchInputProps & {
  defaultValues?: Record<string, boolean>;
};

export default {
  component: SwitchInput,
};

const colors: SwitchProps["color"][] = [
  "primary",
  "secondary",
  "success",
  "warning",
  "error",
];

const allSelected = colors.reduce((accumulator, color) => {
  return {
    ...accumulator,
    [`${color}`]: true,
    [`${color}`]: true,
  };
}, {});

const Template: StoryFn<SwitchInputArgs> = (args) => {
  const { defaultValues, ...rest } = args;
  return (
    <Form
      onSubmit={action("Submit Form")}
      options={{
        defaultValues,
      }}
    >
      {colors.map((color) => (
        <div
          key={`${color}`}
          data-h2-display="base(flex)"
          data-h2-margin-bottom="base(x.5)"
        >
          <SwitchInput
            {...rest}
            id={`${color}`}
            name={`${color}`}
            color={color}
            label={color}
          />
        </div>
      ))}
      <Submit />
    </Form>
  );
};

export const Default = Template.bind({});
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      dark: allModes.dark,
    },
  },
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: {
    default: CheckIcon,
    checked: XMarkIcon,
  },
};

export const HiddenLabel = Template.bind({});
HiddenLabel.args = {
  hideLabel: true,
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  defaultValues: allSelected,
};

export const Required = Template.bind({});
Required.args = {
  rules: {
    required: "This field is required",
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  icon: {
    default: CheckIcon,
    checked: XMarkIcon,
  },
};

export const DisabledChecked = Template.bind({});
DisabledChecked.args = {
  disabled: true,
  defaultValues: allSelected,
  icon: {
    default: CheckIcon,
    checked: XMarkIcon,
  },
};
