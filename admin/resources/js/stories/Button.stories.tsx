import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Button, { ButtonProps } from "../components/H2Components/Button";

export default {
  component: Button,
  title: "Components/Button",
  argTypes: {
    onClick: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const TemplateButton: Story<ButtonProps> = (args) => {
  return <Button {...args} />;
};

export const ButtonPrimary = TemplateButton.bind({});
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
  children: "Button Label",
  color: "primary",
  mode: "solid",
  onClick: action("Button clicked"),
};

ButtonPrimaryOutline.args = {
  children: "Button Label",
  color: "primary",
  mode: "outline",
  onClick: action("Button clicked"),
};

ButtonPrimaryInline.args = {
  children: "Button Label",
  color: "primary",
  mode: "inline",
  onClick: action("Button clicked"),
};

ButtonSecondary.args = {
  children: "Button Label",
  color: "secondary",
  mode: "solid",
  onClick: action("Button clicked"),
};

ButtonSecondaryOutline.args = {
  children: "Button Label",
  color: "secondary",
  mode: "outline",
  onClick: action("Button clicked"),
};

ButtonSecondaryInline.args = {
  children: "Button Label",
  color: "secondary",
  mode: "inline",
  onClick: action("Button clicked"),
};

ButtonCTA.args = {
  children: "Button Label",
  color: "cta",
  mode: "solid",
  onClick: action("Button clicked"),
};

ButtonCTAOutline.args = {
  children: "Button Label",
  color: "cta",
  mode: "outline",
  onClick: action("Button clicked"),
};

ButtonCTAInline.args = {
  children: "Button Label",
  color: "cta",
  mode: "inline",
  onClick: action("Button clicked"),
};

ButtonWhite.args = {
  children: "Button Label",
  color: "white",
  mode: "solid",
  onClick: action("Button clicked"),
};

ButtonWhiteOutline.args = {
  children: "Button Label",
  color: "white",
  mode: "outline",
  onClick: action("Button clicked"),
};

ButtonWhiteInline.args = {
  children: "Button Label",
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
