import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Button from "./Button";
import type { ButtonProps } from "./Button";

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

const TemplateButton: Story<ButtonProps & { label: string }> = (args) => {
  const { label, ...rest } = args;
  return (
    <Button {...rest}>
      <span>{label}</span>
    </Button>
  );
};

export const ButtonPrimary = TemplateButton.bind({});
export const ButtonPrimaryBlock = TemplateButton.bind({});
export const ButtonPrimaryOutline = TemplateButton.bind({});
export const ButtonPrimaryInline = TemplateButton.bind({});
export const ButtonSecondary = TemplateButton.bind({});
export const ButtonSecondaryOutline = TemplateButton.bind({});
export const ButtonSecondaryInline = TemplateButton.bind({});
export const ButtonCTA = TemplateButton.bind({});
export const ButtonCTAOutline = TemplateButton.bind({});
export const ButtonCTAInline = TemplateButton.bind({});
export const ButtonWhite = TemplateButton.bind({});
export const ButtonWhiteOutline = TemplateButton.bind({});
export const ButtonWhiteInline = TemplateButton.bind({});

ButtonPrimary.args = {
  color: "primary",
  mode: "solid",
  onClick: action("Button clicked"),
};

ButtonPrimaryBlock.args = {
  color: "primary",
  mode: "solid",
  block: true,
  onClick: action("Button clicked"),
};

ButtonPrimaryOutline.args = {
  color: "primary",
  mode: "outline",
  onClick: action("Button clicked"),
};

ButtonPrimaryInline.args = {
  color: "primary",
  mode: "inline",
  onClick: action("Button clicked"),
};

ButtonSecondary.args = {
  color: "secondary",
  mode: "solid",
  onClick: action("Button clicked"),
};

ButtonSecondaryOutline.args = {
  color: "secondary",
  mode: "outline",
  onClick: action("Button clicked"),
};

ButtonSecondaryInline.args = {
  color: "secondary",
  mode: "inline",
  onClick: action("Button clicked"),
};

ButtonCTA.args = {
  color: "cta",
  mode: "solid",
  onClick: action("Button clicked"),
};

ButtonCTAOutline.args = {
  color: "cta",
  mode: "outline",
  onClick: action("Button clicked"),
};

ButtonCTAInline.args = {
  color: "cta",
  mode: "inline",
  onClick: action("Button clicked"),
};

ButtonWhite.args = {
  color: "white",
  mode: "solid",
  onClick: action("Button clicked"),
};

ButtonWhiteOutline.args = {
  color: "white",
  mode: "outline",
  onClick: action("Button clicked"),
};

ButtonWhiteInline.args = {
  color: "white",
  mode: "inline",
  onClick: action("Button clicked"),
};

ButtonWhite.parameters = {
  backgrounds: { default: "dark" },
};

ButtonWhiteOutline.parameters = {
  backgrounds: { default: "dark" },
};

ButtonWhiteInline.parameters = {
  backgrounds: { default: "dark" },
};
