import React from "react";
import type { StoryFn } from "@storybook/react";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import CheckIcon from "@heroicons/react/20/solid/CheckIcon";
import { action } from "@storybook/addon-actions";

import { Color } from "@gc-digital-talent/ui";

import Form from "../BasicForm";
import Submit from "../Submit";
import SwitchInput, { SwitchInputProps } from "./SwitchInput";

type SwitchInputArgs = SwitchInputProps & {
  defaultValues?: Record<string, boolean>;
};

export default {
  component: SwitchInput,
  title: "Form/Switch Input",
};

const colors: Array<Color> = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
  "success",
  "warning",
  "error",
];

const themes: Array<string> = ["light", "dark"];

const allSelected = colors.reduce((accumulator, color) => {
  return {
    ...accumulator,
    [`dark${color}`]: true,
    [`light${color}`]: true,
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
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="p-tablet(1fr 1fr)"
      >
        {themes.map((theme) => (
          <div data-h2={theme} key={theme}>
            <div
              data-h2-background="base(background)"
              data-h2-color="base:dark(black)"
              data-h2-padding="base(x2)"
            >
              <div
                className="flex"
                data-h2-flex-direction="base(column)"
                data-h2-align-items="base(center)"
                data-h2-gap="base(x.5)"
              >
                {colors.map((color) => (
                  <div
                    key={`${theme}-${color}`}
                    className="flex"
                    data-h2-align-items="base(center)"
                    data-h2-gap="base(x1)"
                  >
                    <SwitchInput
                      {...rest}
                      id={`${theme}${color}`}
                      name={`${theme}${color}`}
                      color={color}
                      label={color}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </Form>
  );
};

export const Default = Template.bind({});

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
