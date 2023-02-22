import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import Button from "./Button";
import type { ButtonProps, Color } from "./Button";

export default {
  component: Button,
  title: "Components/Button",
  args: {
    label: "Button Label",
  },
  argTypes: {
    label: {
      name: "label",
      type: { name: "string", required: true },
      control: {
        type: "text",
      },
    },
    onClick: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const colors: Array<Color> = [
  "primary",
  "secondary",
  "cta",
  "white",
  "black",
  "ia-primary",
  "ia-secondary",
  "yellow",
  "red",
  "blue",
];

const Template: Story<Omit<ButtonProps, "color"> & { label: string }> = (
  args,
) => {
  const { label, mode, block, disabled } = args;
  return (
    <>
      {colors.map((color) => (
        <p key={color}>
          <Button color={color} mode={mode} block={block} disabled={disabled}>
            <span>{label}</span>
          </Button>
        </p>
      ))}
    </>
  );
};

export const SolidButton = Template.bind({});
export const OutlineButton = Template.bind({});
export const BlockButton = Template.bind({});
export const DisabledButton = Template.bind({});

SolidButton.args = {
  mode: "solid",
  onClick: action("Button clicked"),
};

OutlineButton.args = {
  mode: "outline",
  onClick: action("Button clicked"),
};

BlockButton.args = {
  mode: "solid",
  block: true,
  onClick: action("Button clicked"),
};

DisabledButton.args = {
  mode: "solid",
  disabled: true,
  onClick: action("Button clicked"),
};
