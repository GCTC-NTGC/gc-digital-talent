import type { StoryFn } from "@storybook/react-vite";
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
        <div key={`${color}`} className="mb-3 flex">
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

export const Default = {
  render: Template,

  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

export const WithIcon = {
  render: Template,

  args: {
    icon: {
      default: CheckIcon,
      checked: XMarkIcon,
    },
  },
};

export const HiddenLabel = {
  render: Template,

  args: {
    hideLabel: true,
  },
};

export const DefaultValue = {
  render: Template,

  args: {
    defaultValues: allSelected,
  },
};

export const Required = {
  render: Template,

  args: {
    rules: {
      required: "This field is required",
    },
  },
};

export const Disabled = {
  render: Template,

  args: {
    disabled: true,
    icon: {
      default: CheckIcon,
      checked: XMarkIcon,
    },
  },
};

export const DisabledChecked = {
  render: Template,

  args: {
    disabled: true,
    defaultValues: allSelected,
    icon: {
      default: CheckIcon,
      checked: XMarkIcon,
    },
  },
};
