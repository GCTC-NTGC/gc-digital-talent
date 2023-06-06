import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import InformationCircleIcon from "@heroicons/react/20/solid/InformationCircleIcon";

import Button from "./Button";
import type { ButtonProps } from "./Button";
import { Color } from "../../types";

type Story = StoryFn<Omit<ButtonProps, "color" | "ref"> & { label: string }>;

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
};

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

const Template: Story = (args) => {
  const { label, ...rest } = args;
  return (
    <div data-h2-display="base(flex)">
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {colors.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Button color={color} {...rest}>
              {label}
            </Button>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {stoplight.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Button color={color} {...rest}>
              {label}
            </Button>
          </p>
        ))}
        <Button disabled {...rest}>
          Disabled
        </Button>
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(white)">
        {black.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Button color={color} {...rest}>
              {label}
            </Button>
          </p>
        ))}
      </div>
      <div data-h2-padding="base(x1)" data-h2-background="base(black)">
        {white.map((color) => (
          <p data-h2-margin="base(0, 0, x.5, 0)" key={color}>
            <Button color={color} {...rest}>
              {label}
            </Button>
          </p>
        ))}
      </div>
    </div>
  );
};

const TemplateButton: Story = (args) => {
  const { label, ...rest } = args;

  return <Button {...rest}>{label}</Button>;
};

export const Default = TemplateButton.bind({});

export const SolidButton = Template.bind({});
SolidButton.args = {
  mode: "solid",
  onClick: action("Button clicked"),
};

export const InlineButton = Template.bind({});
InlineButton.args = {
  mode: "inline",
  onClick: action("Button clicked"),
};

export const CallToActionButton = Template.bind({});
CallToActionButton.args = {
  mode: "cta",
  icon: InformationCircleIcon,
  onClick: action("Button clicked"),
};

export const BlockButton = TemplateButton.bind({});
BlockButton.args = {
  mode: "solid",
  block: true,
  onClick: action("Button clicked"),
};

export const IconButton = Template.bind({});
IconButton.args = {
  mode: "solid",
  icon: InformationCircleIcon,
  onClick: action("Button clicked"),
};
