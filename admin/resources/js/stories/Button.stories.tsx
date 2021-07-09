import React from "react";
import { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Button, { ButtonProps } from "../components/H2Components/Button";

export default {
  component: Button,
  title: "Components/Button",
  argTypes: {
    borderColor: {
      table: {
        disable: true,
      },
    },
    backgroundColor: {
      table: {
        disable: true,
      },
    },
    fontColor: {
      table: {
        disable: true,
      },
    },
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
  borderColor: "lightpurple",
  backgroundColor: "lightpurple",
  fontColor: "white",
  onClick: action("Button clicked"),
};

ButtonPrimaryOutline.args = {
  children: "Button Label",
  borderColor: "lightpurple",
  backgroundColor: "[light]lightpurple[.1]",
  fontColor: "lightpurple",
  onClick: action("Button clicked"),
};

ButtonPrimaryInline.args = {
  children: "Button Label",
  borderColor: "[light]white[0]",
  backgroundColor: "[light]white[0]",
  fontColor: "lightpurple",
  onClick: action("Button clicked"),
};

ButtonSecondary.args = {
  children: "Button Label",
  borderColor: "lightnavy",
  backgroundColor: "lightnavy",
  fontColor: "white",
  onClick: action("Button clicked"),
};

ButtonSecondaryOutline.args = {
  children: "Button Label",
  borderColor: "lightnavy",
  backgroundColor: "[light]lightnavy[.1]",
  fontColor: "lightnavy",
  onClick: action("Button clicked"),
};

ButtonSecondaryInline.args = {
  children: "Button Label",
  borderColor: "[light]white[0]",
  backgroundColor: "[light]white[0]",
  fontColor: "lightnavy",
  onClick: action("Button clicked"),
};

ButtonCTA.args = {
  children: "Button Label",
  borderColor: "darkgold",
  backgroundColor: "darkgold",
  fontColor: "black",
  onClick: action("Button clicked"),
};

ButtonCTAOutline.args = {
  children: "Button Label",
  borderColor: "darkgold",
  backgroundColor: "[light]darkgold[.1]",
  fontColor: "darkgold",
  onClick: action("Button clicked"),
};

ButtonCTAInline.args = {
  children: "Button Label",
  borderColor: "[light]white[0]",
  backgroundColor: "[light]white[0]",
  fontColor: "darkgold",
  onClick: action("Button clicked"),
};

ButtonWhite.args = {
  children: "Button Label",
  borderColor: "white",
  backgroundColor: "white",
  fontColor: "lightpurple",
  onClick: action("Button clicked"),
};

ButtonWhiteOutline.args = {
  children: "Button Label",
  borderColor: "white",
  backgroundColor: "[light]white[0]",
  fontColor: "white",
  onClick: action("Button clicked"),
};

ButtonWhiteInline.args = {
  children: "Button Label",
  borderColor: "[light]white[0]",
  backgroundColor: "[light]white[0]",
  fontColor: "white",
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
