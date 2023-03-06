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
  "tertiary",
  "quaternary",
  "quinary",
];
const stoplight: Array<Color> = ["success", "warning", "error"];
const black: Array<Color> = ["black"];
const white: Array<Color> = ["white"];

const Template: Story<Omit<ButtonProps, "color"> & { label: string }> = (
  args,
) => {
  const { label, mode, block, disabled } = args;
  return (
    <div data-h2-display="base(flex)">
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {colors.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Button color={color} mode={mode} block={block} disabled={disabled}>
              <span>{label}</span>
            </Button>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {stoplight.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Button color={color} mode={mode} block={block} disabled={disabled}>
              <span>{label}</span>
            </Button>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {black.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Button color={color} mode={mode} block={block} disabled={disabled}>
              <span>{label}</span>
            </Button>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(black)">
        {white.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Button color={color} mode={mode} block={block} disabled={disabled}>
              <span>{label}</span>
            </Button>
          </p>
        ))}
      </div>
    </div>
  );
};

export const SolidButton = Template.bind({});
export const OutlineButton = Template.bind({});
export const InlineButton = Template.bind({});
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

InlineButton.args = {
  mode: "inline",
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
